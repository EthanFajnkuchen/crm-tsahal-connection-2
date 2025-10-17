import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GoogleContactsService } from '../google-contacts/google-contacts.service';
import { LeadService } from '../lead/lead.service';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly googleContactsService: GoogleContactsService,
    private readonly leadService: LeadService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailySync() {
    this.logger.log('Starting daily Google Contacts sync...');
    try {
      await this.syncGoogleContactsWithCRM();
      this.logger.log('Daily Google Contacts sync completed successfully');
    } catch (error) {
      this.logger.error('Daily Google Contacts sync failed:', error);
    }
  }

  async syncGoogleContactsWithCRM() {
    try {
      // Récupérer tous les contacts Google avec Lead ID
      const googleContactsResponse =
        await this.googleContactsService.getContactsWithLeadId();

      if (!googleContactsResponse.success) {
        this.logger.warn('Google Contacts API not available, skipping sync');
        return;
      }

      const googleContacts = googleContactsResponse.contacts;
      this.logger.log(
        `Found ${googleContacts.length} Google contacts with Lead ID`,
      );

      let syncedCount = 0;
      let updatedCount = 0;
      let errorCount = 0;

      for (const googleContact of googleContacts) {
        try {
          if (!googleContact.leadId) {
            this.logger.warn(`Google contact has no leadId, skipping`);
            continue;
          }

          // Récupérer le lead depuis la base de données
          const lead = await this.leadService.getLeadById(
            googleContact.leadId.toString(),
          );

          if (!lead) {
            this.logger.warn(
              `Lead with ID ${googleContact.leadId} not found in database`,
            );
            continue;
          }

          // Comparer et synchroniser les numéros de téléphone
          const needsUpdate = await this.compareAndUpdatePhoneNumbers(
            lead,
            googleContact,
          );

          if (needsUpdate) {
            updatedCount++;
            this.logger.log(
              `Updated phone numbers for lead ID: ${googleContact.leadId}`,
            );
          } else {
            this.logger.log(
              `Lead ID ${googleContact.leadId} is already in sync`,
            );
          }

          syncedCount++;
        } catch (error) {
          errorCount++;
          this.logger.error(
            `Error syncing lead ID ${googleContact.leadId}:`,
            error,
          );
        }
      }

      this.logger.log(
        `Sync completed: ${syncedCount} processed, ${updatedCount} updated, ${errorCount} errors`,
      );
    } catch (error) {
      this.logger.error('Error during Google Contacts sync:', error);
      throw error;
    }
  }

  private async compareAndUpdatePhoneNumbers(
    lead: any,
    googleContact: any,
  ): Promise<boolean> {
    let needsUpdate = false;
    const updateData: any = {};

    // Nettoyer les numéros de la base de données pour comparaison
    const cleanDbPhoneNumber = this.cleanPhoneNumber(lead.phoneNumber);
    const cleanDbWhatsappNumber = this.cleanPhoneNumber(lead.whatsappNumber);

    // Comparer le numéro mobile
    if (
      googleContact.mobilePhone &&
      cleanDbPhoneNumber !== googleContact.mobilePhone
    ) {
      this.logger.log(
        `Lead ${lead.ID}: phoneNumber mismatch - DB: ${lead.phoneNumber} (cleaned: ${cleanDbPhoneNumber}), Google: ${googleContact.mobilePhone}`,
      );
      updateData.phoneNumber = googleContact.mobilePhone;
      needsUpdate = true;
    }

    // Comparer le numéro WhatsApp (other phone)
    if (
      googleContact.otherPhone &&
      cleanDbWhatsappNumber !== googleContact.otherPhone
    ) {
      this.logger.log(
        `Lead ${lead.ID}: whatsappNumber mismatch - DB: ${lead.whatsappNumber} (cleaned: ${cleanDbWhatsappNumber}), Google: ${googleContact.otherPhone}`,
      );
      updateData.whatsappNumber = googleContact.otherPhone;
      needsUpdate = true;
    }

    // Mettre à jour si nécessaire
    if (needsUpdate) {
      await this.leadService.updateLead(lead.ID.toString(), updateData);
    }

    return needsUpdate;
  }

  // Méthode pour déclencher manuellement la synchronisation
  async triggerManualSync() {
    this.logger.log('Manual sync triggered');
    try {
      await this.syncGoogleContactsWithCRM();
      return { success: true, message: 'Manual sync completed successfully' };
    } catch (error) {
      this.logger.error('Manual sync failed:', error);
      return {
        success: false,
        message: 'Manual sync failed',
        error: error.message,
      };
    }
  }

  private cleanPhoneNumber(
    phoneNumber: string | undefined,
  ): string | undefined {
    if (!phoneNumber) {
      return undefined;
    }

    // Supprimer les espaces, tirets, points et parenthèses
    return phoneNumber.replace(/[\s\-\.\(\)]/g, '').trim();
  }
}
