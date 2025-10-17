import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { GoogleContactsService } from './google-contacts.service';
import { GoogleContactsController } from './google-contacts.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [GoogleContactsController],
  providers: [GoogleContactsService],
  exports: [GoogleContactsService],
})
export class GoogleContactsModule {}
