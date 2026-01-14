import {
  Injectable,
  Logger,
  OnModuleInit,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRequest } from './change-request.entity';
import { Lead } from '../lead/lead.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ChangeRequestNotificationService implements OnModuleInit {
  private readonly logger = new Logger(ChangeRequestNotificationService.name);
  private readonly notificationTimers = new Map<number, NodeJS.Timeout>();
  private readonly DEBOUNCE_DELAY_MS =
    10 * // 10 minutes
    60 *
    1000;

  constructor(
    @InjectRepository(ChangeRequest)
    private readonly changeRequestRepository: Repository<ChangeRequest>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  /**
   * Au démarrage du module, récupère les notifications programmées
   * et re-programme les timers pour celles qui sont encore valides
   */
  async onModuleInit() {
    this.logger.log('Initializing change request notification service...');
    await this.restoreScheduledNotifications();
  }

  /**
   * Programme une notification pour un contact donné
   * Annule le timer existant s'il y en a un (debounce)
   */
  async scheduleNotification(leadId: number): Promise<void> {
    // Annuler le timer existant s'il y en a un
    if (this.notificationTimers.has(leadId)) {
      clearTimeout(this.notificationTimers.get(leadId));
      this.logger.debug(`Cancelled existing timer for lead ${leadId}`);
    }

    // Marquer la date de programmation en DB
    const now = new Date();
    await this.changeRequestRepository.update(
      {
        leadId,
        emailNotified: false,
      },
      {
        notificationScheduledAt: now,
      },
    );

    // Créer un nouveau timer
    const timer = setTimeout(async () => {
      try {
        await this.sendGroupedNotification(leadId);
      } catch (error) {
        this.logger.error(
          `Failed to send notification for lead ${leadId}`,
          error.stack,
        );
      } finally {
        this.notificationTimers.delete(leadId);
      }
    }, this.DEBOUNCE_DELAY_MS);

    this.notificationTimers.set(leadId, timer);
    this.logger.debug(
      `Scheduled notification for lead ${leadId} in ${this.DEBOUNCE_DELAY_MS / 1000 / 60} minutes`,
    );
  }

  /**
   * Récupère les notifications programmées au démarrage
   * et re-programme celles qui sont encore dans la fenêtre de debounce
   */
  private async restoreScheduledNotifications(): Promise<void> {
    try {
      const now = new Date();
      const threshold = new Date(now.getTime() - this.DEBOUNCE_DELAY_MS);

      // Récupérer les demandes avec notificationScheduledAt mais pas encore notifiées
      const scheduledRequests = await this.changeRequestRepository
        .createQueryBuilder('cr')
        .where('cr.emailNotified = :notified', { notified: false })
        .andWhere('cr.notificationScheduledAt IS NOT NULL')
        .andWhere('cr.notificationScheduledAt > :threshold', {
          threshold,
        })
        .select('DISTINCT cr.leadId', 'leadId')
        .getRawMany();

      const leadIds = scheduledRequests.map((r) => r.leadId);

      for (const leadId of leadIds) {
        // Calculer le temps restant
        const request = await this.changeRequestRepository.findOne({
          where: { leadId, emailNotified: false },
          order: { notificationScheduledAt: 'DESC' },
        });

        if (request?.notificationScheduledAt) {
          const elapsed =
            now.getTime() - request.notificationScheduledAt.getTime();
          const remaining = this.DEBOUNCE_DELAY_MS - elapsed;

          if (remaining > 0) {
            const timer = setTimeout(async () => {
              try {
                await this.sendGroupedNotification(leadId);
              } catch (error) {
                this.logger.error(
                  `Failed to send restored notification for lead ${leadId}`,
                  error.stack,
                );
              } finally {
                this.notificationTimers.delete(leadId);
              }
            }, remaining);

            this.notificationTimers.set(leadId, timer);
            this.logger.log(
              `Restored notification timer for lead ${leadId} (${Math.round(remaining / 1000 / 60)} minutes remaining)`,
            );
          } else {
            // Le délai est dépassé, envoyer immédiatement
            await this.sendGroupedNotification(leadId);
          }
        }
      }

      this.logger.log(
        `Restored ${this.notificationTimers.size} notification timer(s)`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to restore scheduled notifications',
        error.stack,
      );
    }
  }

  /**
   * Envoie une notification groupée pour un contact donné
   * Groupe par volontaire et envoie un email par groupe
   */
  private async sendGroupedNotification(leadId: number): Promise<void> {
    this.logger.log(`Sending grouped notification for lead ${leadId}`);

    // Récupérer le lead
    const lead = await this.leadRepository.findOne({
      where: { ID: leadId },
    });

    if (!lead) {
      this.logger.warn(`Lead ${leadId} not found, skipping notification`);
      return;
    }

    // Récupérer toutes les demandes non notifiées pour ce contact
    const pendingRequests = await this.changeRequestRepository.find({
      where: {
        leadId,
        emailNotified: false,
      },
      order: { dateModified: 'ASC' },
    });

    if (pendingRequests.length === 0) {
      this.logger.debug(`No pending requests for lead ${leadId} - cancelling notification timer`);
      // Annuler le timer s'il n'y a plus de demandes en attente
      this.cancelNotification(leadId);
      return;
    }

    // Grouper par volontaire
    const groupedByVolunteer = this.groupByVolunteer(pendingRequests);

    // Envoyer un email par groupe de volontaire
    for (const [volunteer, requests] of groupedByVolunteer) {
      try {
        await this.mailService.sendChangeRequestNotificationEmail(
          lead,
          requests,
          volunteer,
        );
        this.logger.log(
          `Sent notification email for ${requests.length} request(s) from ${volunteer} for lead ${leadId}`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to send email for volunteer ${volunteer}`,
          error.stack,
        );
        // Ne pas marquer comme notifié si l'email a échoué
        continue;
      }
    }

    // Marquer toutes les demandes comme notifiées
    await this.changeRequestRepository.update(
      {
        leadId,
        emailNotified: false,
      },
      {
        emailNotified: true,
        emailNotifiedAt: new Date(),
      },
    );

    this.logger.log(
      `Marked ${pendingRequests.length} request(s) as notified for lead ${leadId}`,
    );
  }

  /**
   * Groupe les demandes par volontaire
   */
  private groupByVolunteer(
    requests: ChangeRequest[],
  ): Map<string, ChangeRequest[]> {
    const grouped = new Map<string, ChangeRequest[]>();

    for (const request of requests) {
      const volunteer = request.changedBy;
      if (!grouped.has(volunteer)) {
        grouped.set(volunteer, []);
      }
      grouped.get(volunteer).push(request);
    }

    return grouped;
  }

  /**
   * Annule une notification programmée (utile pour les tests ou cas spéciaux)
   */
  cancelNotification(leadId: number): void {
    if (this.notificationTimers.has(leadId)) {
      clearTimeout(this.notificationTimers.get(leadId));
      this.notificationTimers.delete(leadId);
      this.logger.debug(`Cancelled notification for lead ${leadId}`);
    }
  }
}
