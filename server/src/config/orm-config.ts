import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger le fichier .env approprié selon l'environnement
const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env.local';

dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production', // Auto-sync en dev, pas en production
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10000,
  },
};
