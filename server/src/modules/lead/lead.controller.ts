import { Controller, Get, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
import { parseLimitParam } from 'src/shared/utils/util';
import { parse } from 'path';

@Controller('api/leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  async getLeads(@Query('limit') limit?: string): Promise<Lead[]> {
    const parsedLimit = parseLimitParam(limit);
    return this.leadService.getLeads(parsedLimit);
  }

  @Get('statistics')
  async getStatistics(): Promise<LeadStatistics> {
    return this.leadService.getStatistics();
  }
}
