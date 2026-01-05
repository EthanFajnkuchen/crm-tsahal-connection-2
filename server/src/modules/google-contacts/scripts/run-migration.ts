// Enregistrer tsconfig-paths pour résoudre les chemins absolus
import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { GoogleContactsMigrationService } from '../migration.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Script pour lancer la migration des contacts Google
 *
 * Usage:
 *   Local:      NODE_ENV=development npx ts-node src/modules/google-contacts/scripts/run-migration.ts
 *   Production: NODE_ENV=production npx ts-node src/modules/google-contacts/scripts/run-migration.ts
 *
 * Ce script va:
 * 1. Charger tous les leads du CRM
 * 2. Pour chaque contact Google sans Lead ID:
 *    - Comparer les numéros de téléphone
 *    - Si match trouvé, mettre à jour le contact avec Lead ID + nom + email
 */

async function bootstrap() {
  // Charger le bon fichier .env selon l'environnement
  const envFile =
    process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';
  const envPath = path.resolve(__dirname, '../../../../', envFile);

  console.log(`\n🔧 Chargement de l'environnement depuis: ${envFile}`);
  dotenv.config({ path: envPath });

  console.log("🚀 Initialisation de l'application NestJS...\n");

  // Créer l'application NestJS
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    // Récupérer le service de migration
    const migrationService = app.get(GoogleContactsMigrationService);

    console.log("⏳ Attente de l'initialisation de l'API Google...");
    // Attendre 2 secondes pour que l'API Google s'initialise complètement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('📱 Lancement de la migration Google Contacts...\n');

    // Lancer la migration
    const result = await migrationService.runMigration();

    // Afficher un résumé détaillé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ DE LA MIGRATION');
    console.log('='.repeat(60));
    console.log(`✅ Statut: ${result.success ? 'SUCCÈS' : 'ÉCHEC'}`);
    console.log(`📋 Leads dans le CRM: ${result.totalLeads}`);
    console.log(`🔗 Contacts matchés: ${result.matched}`);
    console.log(`📝 Contacts mis à jour: ${result.updated}`);
    console.log(
      `❓ Contacts non matchés: ${result.unmatchedContactsCount || 0}`,
    );
    if (result.csvFilePath) {
      console.log(`📄 Fichier CSV créé: ${result.csvFilePath}`);
    }
    console.log(`⏱️  Durée: ${Math.round(result.duration / 1000)}s`);
    console.log(`❌ Erreurs: ${result.errors.length}`);
    console.log('='.repeat(60));

    if (result.errors.length > 0) {
      console.log('\n⚠️  Détails des erreurs:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (result.success) {
      console.log('\n✨ Migration terminée avec succès!\n');
      process.exit(0);
    } else {
      console.log('\n❌ La migration a échoué.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Erreur lors de la migration:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    // Fermer l'application NestJS proprement
    await app.close();
  }
}

// Lancer le script
bootstrap().catch((error) => {
  console.error('💥 Erreur fatale:', error);
  process.exit(1);
});
