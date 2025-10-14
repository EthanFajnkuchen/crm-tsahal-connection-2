import { Module } from '@nestjs/common';
import { GoogleContactsService } from './google-contacts.service';
import { GoogleContactsController } from './google-contacts.controller';

@Module({
  controllers: [GoogleContactsController],
  providers: [GoogleContactsService],
  exports: [GoogleContactsService],
})
export class GoogleContactsModule {}
