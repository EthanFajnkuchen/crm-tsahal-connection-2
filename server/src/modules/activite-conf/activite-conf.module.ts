import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiviteConf } from './activite-conf.entity';
import { ActiviteConfService } from './activite-conf.service';
import { ActiviteConfController } from './activite-conf.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ActiviteConf])],
  controllers: [ActiviteConfController],
  providers: [ActiviteConfService],
  exports: [ActiviteConfService],
})
export class ActiviteConfModule {}
