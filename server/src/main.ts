import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration pour augmenter la limite des payloads (pour les images en base64)
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://crm-tc.netlify.app',
      'http://localhost:3001',
      'https://tsahalco.com/',
      'https://tsahalco.com',
    ],
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
