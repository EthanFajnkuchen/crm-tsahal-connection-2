import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { DiscussionModule } from '../discussion/discussion.module';
import { MailModule } from '../mail/mail.module';
import { GoogleContactsModule } from '../google-contacts/google-contacts.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), DiscussionModule, MailModule, GoogleContactsModule],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
