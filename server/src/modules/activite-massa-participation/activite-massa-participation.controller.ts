import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ActiviteMassaParticipationService } from './activite-massa-participation.service';
import { ActiviteMassaParticipation } from './activite-massa-participation.entity';
import {
  CreateActiviteMassaParticipationDto,
  UpdateActiviteMassaParticipationDto,
} from './activite-massa-participation.dto';

@Controller('api/activite-massa-participation')
export class ActiviteMassaParticipationController {
  constructor(
    private readonly activiteMassaParticipationService: ActiviteMassaParticipationService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body()
    createActiviteMassaParticipationDto: CreateActiviteMassaParticipationDto,
  ): Promise<ActiviteMassaParticipation> {
    return this.activiteMassaParticipationService.create(
      createActiviteMassaParticipationDto,
    );
  }

  @Get()
  async findAll(
    @Query('id_activite_massa') id_activite_massa?: string,
    @Query('lead_id') lead_id?: string,
  ): Promise<ActiviteMassaParticipation[]> {
    return this.activiteMassaParticipationService.findAll(
      id_activite_massa ? +id_activite_massa : undefined,
      lead_id ? +lead_id : undefined,
    );
  }

  @Get('by-activite-massa/:id_activite_massa')
  async findByActiviteMassa(
    @Param('id_activite_massa') id_activite_massa: string,
  ): Promise<ActiviteMassaParticipation[]> {
    return this.activiteMassaParticipationService.findByActiviteMassa(
      +id_activite_massa,
    );
  }

  @Get('by-lead/:lead_id')
  async findByLead(
    @Param('lead_id') lead_id: string,
  ): Promise<ActiviteMassaParticipation[]> {
    return this.activiteMassaParticipationService.findByLead(+lead_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActiviteMassaParticipation> {
    return this.activiteMassaParticipationService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body()
    updateActiviteMassaParticipationDto: UpdateActiviteMassaParticipationDto,
  ): Promise<ActiviteMassaParticipation> {
    return this.activiteMassaParticipationService.update(
      +id,
      updateActiviteMassaParticipationDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.activiteMassaParticipationService.remove(+id);
  }
}
