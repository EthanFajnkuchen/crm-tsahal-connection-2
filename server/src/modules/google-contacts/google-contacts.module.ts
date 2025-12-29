import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GoogleContactsService } from './google-contacts.service';
import { GoogleContactsController } from './google-contacts.controller';
import { GoogleContactsMigrationService } from './migration.service';
import { LeadModule } from '../lead/lead.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    forwardRef(() => LeadModule), // Import LeadModule avec forwardRef pour éviter la dépendance circulaire
  ],
  controllers: [GoogleContactsController],
  providers: [GoogleContactsService, GoogleContactsMigrationService],
  exports: [GoogleContactsService, GoogleContactsMigrationService],
})
export class GoogleContactsModule {}
