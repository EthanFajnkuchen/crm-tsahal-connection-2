import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './lead.entity';
import { LeadService } from './lead.service';
import { LeadController } from './lead.controller';
import { DiscussionModule } from '../discussion/discussion.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lead]), DiscussionModule, MailModule],
  controllers: [LeadController],
  providers: [LeadService],
  exports: [LeadService],
})
export class LeadModule {}
