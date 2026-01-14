import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequest } from './change-request.entity';
import { Lead } from '../lead/lead.entity';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequestController } from './change-request.controller';
import { ChangeRequestNotificationService } from './change-request-notification.service';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChangeRequest, Lead]),
    forwardRef(() => MailModule),
  ],
  controllers: [ChangeRequestController],
  providers: [ChangeRequestService, ChangeRequestNotificationService],
  exports: [ChangeRequestService, ChangeRequestNotificationService],
})
export class ChangeRequestModule {}
