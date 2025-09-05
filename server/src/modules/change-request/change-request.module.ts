import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequest } from './change-request.entity';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequestController } from './change-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeRequest])],
  controllers: [ChangeRequestController],
  providers: [ChangeRequestService],
  exports: [ChangeRequestService],
})
export class ChangeRequestModule {}
