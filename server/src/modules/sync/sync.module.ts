import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { SyncService } from './sync.service';
import { SyncController } from './sync.controller';
import { GoogleContactsModule } from '../google-contacts/google-contacts.module';
import { LeadModule } from '../lead/lead.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    GoogleContactsModule,
    LeadModule,
  ],
  controllers: [SyncController],
  providers: [SyncService],
  exports: [SyncService],
})
export class SyncModule {}
