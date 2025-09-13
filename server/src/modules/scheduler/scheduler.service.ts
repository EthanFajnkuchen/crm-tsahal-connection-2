import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Lead } from '../lead/lead.entity';
import { MailService } from '../mail/mail.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    private readonly mailService: MailService,
  ) {}

  // Cron job qui s'exécute tous les samedis à 18h00
  // Format: '0 18 * * 6' = seconde minute heure jour mois jour-de-la-semaine
  // 6 = samedi (0 = dimanche, 1 = lundi, ..., 6 = samedi)
  @Cron('0 18 * * 6', {
    name: 'weekly-shihourim-report',
    timeZone: 'Asia/Jerusalem', // Timezone d'Israël
  })
  async sendWeeklyShihourimReport(): Promise<void> {
    this.logger.log('Starting weekly Shihourim report job...');

    try {
      // Calculer les dates pour la semaine suivante (7 jours après aujourd'hui)
      const today = new Date();
      const nextWeekStart = new Date(today);
      nextWeekStart.setDate(today.getDate() + 1); // Demain

      const nextWeekEnd = new Date(today);
      nextWeekEnd.setDate(today.getDate() + 7); // Dans 7 jours

      // Formatter les dates pour la requête (format YYYY-MM-DD)
      const startDateStr = this.formatDateForQuery(nextWeekStart);
      const endDateStr = this.formatDateForQuery(nextWeekEnd);

      this.logger.log(
        `Searching for leads with dateFinService between ${startDateStr} and ${endDateStr}`,
      );

      // Récupérer les leads dont la dateFinService est dans la semaine suivante
      const leads = await this.leadRepository
        .createQueryBuilder('lead')
        .where('lead.dateFinService >= :startDate', { startDate: startDateStr })
        .andWhere('lead.dateFinService <= :endDate', { endDate: endDateStr })
        .andWhere('lead.dateFinService IS NOT NULL')
        .andWhere('lead.dateFinService != ""')
        .orderBy('lead.dateFinService', 'ASC')
        .getMany();

      this.logger.log(
        `Found ${leads.length} leads with dateFinService in the next week`,
      );

      // Envoyer l'email avec les résultats
      await this.mailService.sendShihourimWeeklyReport(leads);

      this.logger.log(
        `Weekly Shihourim report sent successfully with ${leads.length} leads`,
      );
    } catch (error) {
      this.logger.error('Failed to send weekly Shihourim report', error.stack);
      throw error;
    }
  }

  // Méthode utilitaire pour formater les dates au format YYYY-MM-DD
  private formatDateForQuery(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Méthode pour tester manuellement l'envoi (utile pour le développement)
  async sendTestShihourimReport(startDate?: string): Promise<{
    leadsCount: number;
    dateRange: string;
  }> {
    this.logger.log('Sending test Shihourim report...');

    if (startDate) {
      this.logger.log(`Using custom start date: ${startDate}`);
      return await this.sendCustomDateShihourimReport(startDate);
    } else {
      await this.sendWeeklyShihourimReport();
      return {
        leadsCount: 0, // On ne peut pas retourner le count facilement pour la méthode normale
        dateRange: 'Current week (+7 days from today)',
      };
    }
  }

  // Méthode pour envoyer un rapport avec une date personnalisée
  async sendCustomDateShihourimReport(startDate: string): Promise<{
    leadsCount: number;
    dateRange: string;
  }> {
    try {
      // Parser la date de début fournie
      const customStartDate = new Date(startDate);
      if (isNaN(customStartDate.getTime())) {
        throw new Error('Invalid date format. Use YYYY-MM-DD format.');
      }

      // Calculer la date de fin (7 jours après la date de début)
      const customEndDate = new Date(customStartDate);
      customEndDate.setDate(customStartDate.getDate() + 7);

      // Formatter les dates pour la requête
      const startDateStr = this.formatDateForQuery(customStartDate);
      const endDateStr = this.formatDateForQuery(customEndDate);

      this.logger.log(
        `Searching for leads with dateFinService between ${startDateStr} and ${endDateStr}`,
      );

      // Récupérer les leads pour la période personnalisée
      const leads = await this.leadRepository
        .createQueryBuilder('lead')
        .where('lead.dateFinService >= :startDate', { startDate: startDateStr })
        .andWhere('lead.dateFinService <= :endDate', { endDate: endDateStr })
        .andWhere('lead.dateFinService IS NOT NULL')
        .andWhere('lead.dateFinService != ""')
        .orderBy('lead.dateFinService', 'ASC')
        .getMany();

      this.logger.log(
        `Found ${leads.length} leads with dateFinService between ${startDateStr} and ${endDateStr}`,
      );

      // Envoyer l'email avec les résultats
      await this.mailService.sendShihourimWeeklyReport(leads);

      this.logger.log(
        `Custom Shihourim report sent successfully with ${leads.length} leads`,
      );

      return {
        leadsCount: leads.length,
        dateRange: `${startDateStr} to ${endDateStr}`,
      };
    } catch (error) {
      this.logger.error('Failed to send custom Shihourim report', error.stack);
      throw error;
    }
  }

  // Cron job pour vérifier la connexion mail tous les jours à 9h
  @Cron('0 9 * * *', {
    name: 'daily-mail-health-check',
    timeZone: 'Asia/Jerusalem',
  })
  async dailyMailHealthCheck(): Promise<void> {
    this.logger.log('Running daily mail service health check...');

    try {
      const isHealthy = await this.mailService.testConnection();
      if (isHealthy) {
        this.logger.log('Mail service health check passed');
      } else {
        this.logger.warn('Mail service health check failed');
      }
    } catch (error) {
      this.logger.error('Mail service health check error', error.stack);
    }
  }
}
