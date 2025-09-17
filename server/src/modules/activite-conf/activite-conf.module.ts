import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActiviteConf } from './activite-conf.entity';
import { ActiviteConfService } from './activite-conf.service';
import { ActiviteConfController } from './activite-conf.controller';
import { MailModule } from '../mail/mail.module';
import { ActivityModule } from '../activity/activity.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ActiviteConf]),
    MailModule,
    ActivityModule,
  ],
  controllers: [ActiviteConfController],
  providers: [ActiviteConfService],
  exports: [ActiviteConfService],
})
export class ActiviteConfModule {}
