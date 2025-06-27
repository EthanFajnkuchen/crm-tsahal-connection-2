import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
import { parseLimitParam } from 'src/shared/utils/util';
import { Permissions } from './../../shared/decorators/permissions.decorator';
import { LeadFilterDto, UpdateLeadDto } from './lead.dto';

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
  @Permissions('read:data')
  async getStats(@Query('current') current: string) {
    const isCurrent = current === 'true';
    const stats = await this.leadService.getProductStats(isCurrent);
    return stats;
  }

  @Get('expert-co-stats-by-year')
  @Permissions('read:data')
  async getStatsByYear() {
    return this.leadService.getStatsExpertCoByYear();
  }

  @Get('mahzor-giyus-counts')
  @Permissions('read:data')
  async getMahzorGiyusCounts() {
    return this.leadService.getMahzorGiyusCounts();
  }

  @Get('tafkidim')
  @Permissions('read:data')
  async getTafkidim() {
    return this.leadService.getTafkidim();
  }

  @Get('download')
  @Permissions('read:data')
  async downloadLeads() {
    return this.leadService.downloadLeads();
  }

  @Get(':id')
  @Permissions('read:data')
  async getLeadById(@Param('id') id: string) {
    return this.leadService.getLeadById(id);
  }

  @Put(':id')
  @Permissions('write:data')
  async updateLead(
    @Param('id') id: string,
    @Body() updateData: UpdateLeadDto,
  ): Promise<Lead> {
    return this.leadService.updateLead(id, updateData);
  }
}
