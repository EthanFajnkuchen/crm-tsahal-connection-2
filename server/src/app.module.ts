import {
  Module,
  OnModuleInit,
  Logger,
  NestModule,
  MiddlewareConsumer,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { typeOrmConfig } from './config/orm-config';
import { LeadModule } from './modules/lead/lead.module';
import { DiscussionModule } from './modules/discussion/discussion.module';
import { ChangeRequestModule } from './modules/change-request/change-request.module';
import { MailModule } from './modules/mail/mail.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { ActivityModule } from './modules/activity/activity.module';
import { ActiviteConfModule } from './modules/activite-conf/activite-conf.module';
import { ActiviteMassaModule } from './modules/activite-massa/activite-massa.module';
import { ActiviteMassaParticipationModule } from './modules/activite-massa-participation/activite-massa-participation.module';
import { GoogleContactsModule } from './modules/google-contacts/google-contacts.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { LoggerMiddleware } from './middlewares/logging.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(typeOrmConfig),
    LeadModule,
    DiscussionModule,
    ChangeRequestModule,
    MailModule,
    SchedulerModule,
    ActivityModule,
    ActiviteConfModule,
    ActiviteMassaModule,
    ActiviteMassaParticipationModule,
    GoogleContactsModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule, OnModuleInit {
  private readonly logger = new Logger(AppModule.name);

  onModuleInit() {
    this.logger.log('Successfully connected to the database');
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
