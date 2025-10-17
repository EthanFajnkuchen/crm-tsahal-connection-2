import { Controller, Post, UseGuards } from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('sync')
@UseGuards(JwtAuthGuard)
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('google-contacts')
  async triggerGoogleContactsSync() {
    return this.syncService.triggerManualSync();
  }
}

