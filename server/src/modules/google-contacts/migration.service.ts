import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { GoogleContactsService } from './google-contacts.service';
import { LeadService } from '../lead/lead.service';

@Injectable()
export class GoogleContactsMigrationService {
  private readonly logger = new Logger(GoogleContactsMigrationService.name);

  constructor(
    private readonly googleContactsService: GoogleContactsService,
    @Inject(forwardRef(() => LeadService))
    private readonly leadService: LeadService,
  ) {}

  /**
   * Lance la migration complète des contacts Google existants
   * Cette méthode doit être appelée une seule fois pour migrer les anciens contacts
   */
  async runMigration(): Promise<{
    success: boolean;
    totalLeads: number;
    matched: number;
    updated: number;
    unmatchedContactsCount: number;
    csvFilePath?: string;
    errors: string[];
    duration: number;
  }> {
    const startTime = Date.now();

    try {
      this.logger.log('='.repeat(50));
      this.logger.log('DÉBUT DE LA MIGRATION GOOGLE CONTACTS');
      this.logger.log('='.repeat(50));

      // Récupérer tous les leads du CRM
      this.logger.log('Récupération de tous les leads depuis le CRM...');
      const allLeads = await this.leadService.getAllLeads();

      this.logger.log(`${allLeads.length} leads récupérés depuis le CRM`);

      if (allLeads.length === 0) {
        this.logger.warn('Aucun lead trouvé dans le CRM - migration annulée');
        return {
          success: false,
          totalLeads: 0,
          matched: 0,
          updated: 0,
          unmatchedContactsCount: 0,
          errors: ['Aucun lead trouvé dans le CRM'],
          duration: Date.now() - startTime,
        };
      }

      // Lancer la migration
      const result =
        await this.googleContactsService.migrateExistingContacts(allLeads);

      const duration = Date.now() - startTime;

      this.logger.log('='.repeat(50));
      this.logger.log('RÉSULTATS DE LA MIGRATION:');
      this.logger.log(`- Leads dans le CRM: ${allLeads.length}`);
      this.logger.log(`- Contacts matchés: ${result.matched}`);
      this.logger.log(`- Contacts mis à jour: ${result.updated}`);
      this.logger.log(
        `- Contacts non matchés: ${result.unmatchedContactsCount}`,
      );
      if (result.csvFilePath) {
        this.logger.log(`- Fichier CSV créé: ${result.csvFilePath}`);
      }
      this.logger.log(`- Erreurs: ${result.errors.length}`);
      this.logger.log(`- Durée: ${Math.round(duration / 1000)}s`);
      this.logger.log('='.repeat(50));

      if (result.errors.length > 0) {
        this.logger.error('Erreurs rencontrées:');
        result.errors.forEach((error, index) => {
          this.logger.error(`${index + 1}. ${error}`);
        });
      }

      return {
        ...result,
        totalLeads: allLeads.length,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      this.logger.error('Migration échouée:', error);

      return {
        success: false,
        totalLeads: 0,
        matched: 0,
        updated: 0,
        unmatchedContactsCount: 0,
        errors: [error.message],
        duration,
      };
    }
  }
}
