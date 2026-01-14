// Enregistrer tsconfig-paths pour résoudre les chemins absolus
import 'tsconfig-paths/register';

import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { GoogleContactsService } from '../google-contacts.service';
import * as dotenv from 'dotenv';
import * as path from 'path';

/**
 * Script pour lister les contacts Google sans Lead ID et créer un CSV
 * Ne fait aucune modification, juste un export
 *
 * Usage:
 *   Local:      NODE_ENV=development npx ts-node src/modules/google-contacts/scripts/list-contacts-without-leadid.ts
 *   Production: NODE_ENV=production npx ts-node src/modules/google-contacts/scripts/list-contacts-without-leadid.ts
 *
 * Ce script va:
 * 1. Récupérer tous les contacts Google
 * 2. Filtrer ceux qui n'ont pas de Lead ID
 * 3. Créer un fichier CSV avec ces contacts (sans faire de modifications)
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
    // Récupérer le service Google Contacts
    const googleContactsService = app.get(GoogleContactsService);

    console.log("⏳ Attente de l'initialisation de l'API Google...");
    // Attendre 2 secondes pour que l'API Google s'initialise complètement
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('📱 Liste des contacts Google sans Lead ID...\n');

    // Lancer la liste des contacts sans Lead ID
    const result = await googleContactsService.listContactsWithoutLeadId();

    // Afficher un résumé détaillé
    console.log('\n' + '='.repeat(60));
    console.log('📊 RÉSUMÉ');
    console.log('='.repeat(60));
    console.log(`✅ Statut: ${result.success ? 'SUCCÈS' : 'ÉCHEC'}`);
    console.log(`📋 Total contacts Google: ${result.totalContacts}`);
    console.log(`❓ Contacts sans Lead ID: ${result.contactsWithoutLeadId}`);
    if (result.csvFilePath) {
      console.log(`📄 Fichier CSV créé: ${result.csvFilePath}`);
    }
    console.log(`❌ Erreurs: ${result.errors.length}`);
    console.log('='.repeat(60));

    if (result.errors.length > 0) {
      console.log('\n⚠️  Détails des erreurs:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
    }

    if (result.success) {
      console.log('\n✨ Liste terminée avec succès!\n');
      process.exit(0);
    } else {
      console.log('\n❌ La liste a échoué.\n');
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Erreur lors de la liste:', error.message);
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
