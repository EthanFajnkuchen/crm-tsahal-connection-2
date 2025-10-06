import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiviteMassa } from './activite-massa.entity';
import { ActiviteMassaService } from './activite-massa.service';
import { ActiviteMassaController } from './activite-massa.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActiviteMassa])],
  controllers: [ActiviteMassaController],
  providers: [ActiviteMassaService],
  exports: [ActiviteMassaService],
})
export class ActiviteMassaModule {}
