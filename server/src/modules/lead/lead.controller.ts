import { Body, Controller, Get, HttpCode, Post, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
import { parseLimitParam } from 'src/shared/utils/util';
import { Permissions } from './../../shared/decorators/permissions.decorator';
import { LeadFilterDto } from './lead.dto';

@Controller('api/leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Get()
  @Permissions('read:data')
  async getLeads(@Query('limit') limit?: string): Promise<Partial<Lead>[]> {
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

  @Post('/filters')
  @HttpCode(200)
  @Permissions('read:data')
  async getLeadsByFilter(@Body() filters: LeadFilterDto) {
    return this.leadService.getLeadsWithFilters(filters);
  }

  @Get('search')
  @Permissions('read:data')
  async searchLeads(
    @Query('input') searchInput: string,
  ): Promise<Partial<Lead>[]> {
    return this.leadService.searchLeads(searchInput);
  }

  @Get('expert-co-statistics')
  @Permissions('read:data')
  async getExpertCoStats() {
    return this.leadService.getExpertCoStats();
  }

  @Get('expert-co-charts')
  async getStats(@Query('current') current: string) {
    const isCurrent = current === 'true';
    const stats = await this.leadService.getProductStats(isCurrent);
    return stats;
  }

  @Get('expert-co-stats-by-year')
  async getStatsByYear() {
    return this.leadService.getStatsExpertCoByYear();
  }
}
