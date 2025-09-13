import { Controller, Post, Get, Query } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { MailService } from '../mail/mail.service';

@Controller('scheduler')
export class SchedulerController {
  constructor(
    private readonly schedulerService: SchedulerService,
    private readonly mailService: MailService,
  ) {}

  @Post('test-shihourim-report')
  async testShihourimReport(@Query('startDate') startDate?: string): Promise<{
    message: string;
    success: boolean;
    leadsCount?: number;
    dateRange?: string;
  }> {
    try {
      const result =
        await this.schedulerService.sendTestShihourimReport(startDate);
      return {
        message: 'Test Shihourim report sent successfully',
        success: true,
        leadsCount: result.leadsCount,
        dateRange: result.dateRange,
      };
    } catch (error) {
      return {
        message: `Failed to send test report: ${error.message}`,
        success: false,
      };
    }
  }

  @Get('mail-health-check')
  async mailHealthCheck(): Promise<{ message: string; healthy: boolean }> {
    try {
      const isHealthy = await this.mailService.testConnection();
      return {
        message: isHealthy
          ? 'Mail service is healthy'
          : 'Mail service connection failed',
        healthy: isHealthy,
      };
    } catch (error) {
      return {
        message: `Mail health check failed: ${error.message}`,
        healthy: false,
      };
    }
  }

  @Get('check-config')
  async checkConfiguration(): Promise<{
    configured: boolean;
    missing: string[];
    recommendations: string[];
  }> {
    const missing: string[] = [];
    const recommendations: string[] = [];

    // Vérifier les variables d'environnement requises
    if (!process.env.GMAIL_USER) {
      missing.push('GMAIL_USER');
      recommendations.push(
        'Ajoutez GMAIL_USER=info@tsahalco.com dans votre fichier .env',
      );
    }

    if (!process.env.GMAIL_APP_PASSWORD) {
      missing.push('GMAIL_APP_PASSWORD');
      recommendations.push(
        "Générez un mot de passe d'application Google et ajoutez GMAIL_APP_PASSWORD=xxx dans votre .env",
      );
    }

    if (!process.env.SHIHOURIM_RECIPIENTS) {
      recommendations.push(
        'Optionnel: Ajoutez SHIHOURIM_RECIPIENTS=email1@domain.com,email2@domain.com pour configurer les destinataires',
      );
    }

    return {
      configured: missing.length === 0,
      missing,
      recommendations,
    };
  }
}
