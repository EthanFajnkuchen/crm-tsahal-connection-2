import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiviteMassaParticipation } from './activite-massa-participation.entity';
import { ActiviteMassaParticipationService } from './activite-massa-participation.service';
import { ActiviteMassaParticipationController } from './activite-massa-participation.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActiviteMassaParticipation])],
  controllers: [ActiviteMassaParticipationController],
  providers: [ActiviteMassaParticipationService],
  exports: [ActiviteMassaParticipationService],
})
export class ActiviteMassaParticipationModule {}
