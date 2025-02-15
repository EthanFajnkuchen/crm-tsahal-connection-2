import { Controller, Get, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
import { parseLimitParam } from 'src/shared/utils/util';
import { Permissions } from './../../shared/decorators/permissions.decorator';

@Controller('api/leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  @Permissions('read:data')
  async getLeads(@Query('limit') limit?: string): Promise<Lead[]> {
    const parsedLimit = parseLimitParam(limit);
    return this.leadService.getLeads(parsedLimit);
  }

  @Get('statistics')
  @Permissions('read:data')
  async getStatistics(): Promise<LeadStatistics> {
    return this.leadService.getStatistics();
  }

  @Get('per-month')
  @Permissions('read:data')
  async getLeadsPerMonth(): Promise<Record<string, number>> {
    return this.leadService.getLeadsPerMonth();
  }

  @Get('per-year')
  @Permissions('read:data')
  async getLeadsPerYear(): Promise<Record<string, number>> {
    return this.leadService.getLeadsPerYear();
  }
}
