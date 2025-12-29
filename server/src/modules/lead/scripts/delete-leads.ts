import { DataSource, DataSourceOptions } from 'typeorm';
import { typeOrmConfig } from '../../../config/orm-config';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger le fichier .env approprié selon l'environnement
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

dotenv.config({ path: path.resolve(__dirname, '../../../../', envFile) });

console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📄 Loading config from: ${envFile}\n`);

/**
 * Script pour supprimer des leads en gérant les contraintes de clé étrangère
 *
 * Usage LOCAL:
 *   npx ts-node src/modules/lead/scripts/delete-leads.ts
 *
 * Usage PRODUCTION:
 *   NODE_ENV=production npx ts-node src/modules/lead/scripts/delete-leads.ts
 */

const LEAD_IDS_TO_DELETE = [10489, 10248, 10398, 9724, 10539];

async function deleteLeadsWithDependencies() {
  const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    for (const leadId of LEAD_IDS_TO_DELETE) {
      console.log(`\n${'='.repeat(60)}`);
      console.log(`🗑️  Processing Lead ID: ${leadId}`);
      console.log('='.repeat(60));

      try {
        // Vérifier si le lead existe
        const leadExists = await dataSource.query(
          'SELECT ID, firstName, lastName FROM leads WHERE ID = ?',
          [leadId],
        );

        if (!leadExists || leadExists.length === 0) {
          console.log(`⚠️  Lead ID ${leadId} not found - skipping`);
          continue;
        }

        const lead = leadExists[0];
        console.log(`📋 Lead: ${lead.firstName} ${lead.lastName}`);

        // 1. Supprimer les discussions
        const discussionsDeleted = await dataSource.query(
          'DELETE FROM discussions WHERE id_lead = ?',
          [leadId],
        );
        console.log(
          `   ✓ Deleted ${discussionsDeleted.affectedRows || 0} discussions`,
        );

        // 3. Supprimer les participations activités massa
        const massaParticipationsDeleted = await dataSource.query(
          'DELETE FROM activite_massa_participation WHERE lead_id = ?',
          [leadId],
        );
        console.log(
          `   ✓ Deleted ${massaParticipationsDeleted.affectedRows || 0} massa participations`,
        );

        // 4. Supprimer les participations activités conf
        const confParticipationsDeleted = await dataSource.query(
          'DELETE FROM activite_conf WHERE lead_id = ?',
          [leadId],
        );
        console.log(
          `   ✓ Deleted ${confParticipationsDeleted.affectedRows || 0} conf participations`,
        );

        // 5. Supprimer les activités générales (si table existe)
        try {
          const activitiesDeleted = await dataSource.query(
            'DELETE FROM activities WHERE leadId = ?',
            [leadId],
          );
          console.log(
            `   ✓ Deleted ${activitiesDeleted.affectedRows || 0} activities`,
          );
        } catch (error) {
          // La table n'existe peut-être pas
          console.log('   ℹ️  No activities table or no records');
        }

        // 6. Supprimer le lead lui-même
        const leadDeleted = await dataSource.query(
          'DELETE FROM leads WHERE ID = ?',
          [leadId],
        );
        console.log(
          `   ✓ Deleted lead ${leadId}: ${lead.firstName} ${lead.lastName}`,
        );

        console.log(`\n✅ Successfully deleted Lead ID ${leadId}`);
      } catch (error) {
        console.error(`\n❌ Error deleting Lead ID ${leadId}:`, error.message);
        // Continue avec les autres leads même en cas d'erreur
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Deletion process completed!');
    console.log('='.repeat(60) + '\n');
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed\n');
    }
  }
}

// Exécuter le script
deleteLeadsWithDependencies()
  .then(() => {
    console.log('✅ Script finished successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
