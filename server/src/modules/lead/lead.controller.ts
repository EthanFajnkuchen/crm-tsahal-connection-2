import {
  Body,
  Controller,
  Delete,
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
import {
  LeadFilterDto,
  UpdateLeadDto,
  BulkTsavRishonGradesUpdateDto,
  BulkTsavRishonDateUpdateDto,
  BulkGiyusUpdateDto,
  CreateLeadDto,
} from './lead.dto';

@Controller('api/leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post('form-submission')
  @HttpCode(201)
  async createLead(@Body() createLeadDto: CreateLeadDto): Promise<{
    success: boolean;
    message: string;
    leadId?: number;
  }> {
    return this.leadService.createLead(createLeadDto);
  }

  @Get()
  @Permissions('read:data')
  async getLeads(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('statutCandidat') statutCandidat?: string,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('gender') gender?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('whatsappNumber') whatsappNumber?: string,
    @Query('passportNumber1') passportNumber1?: string,
    @Query('expertConnection') expertConnection?: string,
    @Query('statutLoiRetour') statutLoiRetour?: string,
    @Query('currentStatus') currentStatus?: string,
    @Query() allQueryParams?: any,
  ): Promise<{ data: Partial<Lead>[]; total: number } | Partial<Lead>[]> {
    const parsedLimit = parseLimitParam(limit);
    const parsedPage = page ? parseInt(page, 10) : undefined;

    // Construire les filtres à partir des query params
    const filters = {
      search,
      dateFrom,
      dateTo,
      statutCandidat,
      firstName,
      lastName,
      gender,
      phoneNumber,
      whatsappNumber,
      passportNumber1,
      expertConnection,
      statutLoiRetour,
      currentStatus,
      // Ajouter tous les autres query params (pour les filtres de colonnes)
      ...Object.fromEntries(
        Object.entries(allQueryParams).filter(
          ([key, value]) =>
            ![
              'limit',
              'page',
              'search',
              'dateFrom',
              'dateTo',
              'statutCandidat',
              'firstName',
              'lastName',
              'gender',
              'phoneNumber',
              'whatsappNumber',
              'passportNumber1',
              'expertConnection',
              'statutLoiRetour',
              'currentStatus',
            ].includes(key),
        ),
      ),
    };

    // Vérifier s'il y a des filtres actifs
    const hasActiveFilters = Object.values(filters).some(
      (value) => value !== undefined && value !== '',
    );

    // Si page est fourni, retourner le format paginé
    if (parsedPage !== undefined) {
      if (hasActiveFilters) {
        return this.leadService.searchLeads(
          filters,
          parsedPage,
          parsedLimit || 15,
        );
      } else {
        return this.leadService.getLeads(parsedLimit || 15, parsedPage);
      }
    }

    // Sinon, retourner seulement les données (compatibilité dashboard)
    if (hasActiveFilters) {
      const result = await this.leadService.searchLeads(
        filters,
        0,
        parsedLimit,
      );
      return result.data;
    } else {
      const result = await this.leadService.getLeads(parsedLimit);
      return result.data;
    }
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

  @Post('search')
  @HttpCode(200)
  @Permissions('read:data')
  async searchLeads(
    @Body()
    filters: any,
  ): Promise<{ data: Partial<Lead>[]; total: number }> {
    return this.leadService.searchLeads(filters);
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
  async downloadLeads(
    @Query('search') search?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
    @Query('statutCandidat') statutCandidat?: string,
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
    @Query('gender') gender?: string,
    @Query('phoneNumber') phoneNumber?: string,
    @Query('whatsappNumber') whatsappNumber?: string,
    @Query('passportNumber1') passportNumber1?: string,
    @Query('expertConnection') expertConnection?: string,
    @Query('statutLoiRetour') statutLoiRetour?: string,
    @Query('currentStatus') currentStatus?: string,
    @Query('mahzorGiyus') mahzorGiyus?: string,
    @Query('typeGiyus') typeGiyus?: string,
    @Query('pikoud') pikoud?: string,
    @Query('city') city?: string,
    @Query('excludeTab1') excludeTab1?: string,
    @Query('excludeTab2') excludeTab2?: string,
    @Query('excludeTab3') excludeTab3?: string,
    @Query('excludeTab4') excludeTab4?: string,
    @Query() allQueryParams?: any,
  ) {
    // Construire les filtres à partir des query params
    const filters = {
      search,
      dateFrom,
      dateTo,
      statutCandidat,
      firstName,
      lastName,
      gender,
      phoneNumber,
      whatsappNumber,
      passportNumber1,
      expertConnection,
      statutLoiRetour,
      currentStatus,
      mahzorGiyus,
      typeGiyus,
      pikoud,
      city,
      excludeTab1,
      excludeTab2,
      excludeTab3,
      excludeTab4,
      // Ajouter tous les autres query params (pour les filtres de colonnes)
      ...Object.fromEntries(
        Object.entries(allQueryParams).filter(
          ([key, value]) =>
            ![
              'search',
              'dateFrom',
              'dateTo',
              'statutCandidat',
              'firstName',
              'lastName',
              'gender',
              'phoneNumber',
              'whatsappNumber',
              'passportNumber1',
              'expertConnection',
              'statutLoiRetour',
              'currentStatus',
              'mahzorGiyus',
              'typeGiyus',
              'pikoud',
              'city',
              'excludeTab1',
              'excludeTab2',
              'excludeTab3',
              'excludeTab4',
            ].includes(key),
        ),
      ),
    };

    return this.leadService.downloadLeads(filters);
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

  @Post('bulk-tsav-rishon-grades')
  @Permissions('write:data')
  async bulkUpdateTsavRishonGrades(
    @Body() bulkData: BulkTsavRishonGradesUpdateDto,
  ): Promise<{
    updated: number;
    failed: number;
    errors: string[];
  }> {
    return this.leadService.bulkUpdateTsavRishonGrades(bulkData);
  }

  @Post('bulk-tsav-rishon-date')
  @Permissions('write:data')
  async bulkUpdateTsavRishonDate(
    @Body() bulkData: BulkTsavRishonDateUpdateDto,
  ): Promise<{
    updated: number;
    failed: number;
    errors: string[];
  }> {
    return this.leadService.bulkUpdateTsavRishonDate(bulkData);
  }

  @Post('bulk-giyus')
  @Permissions('write:data')
  async bulkUpdateGiyus(@Body() bulkData: BulkGiyusUpdateDto): Promise<{
    updated: number;
    failed: number;
    errors: string[];
  }> {
    return this.leadService.bulkUpdateGiyus(bulkData);
  }

  @Delete(':id')
  @Permissions('delete:data')
  async deleteLead(@Param('id') id: string): Promise<{
    success: boolean;
    message: string;
  }> {
    return this.leadService.deleteLead(id);
  }
}
