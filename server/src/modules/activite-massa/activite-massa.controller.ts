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
import { ActiviteMassaService } from './activite-massa.service';
import { ActiviteMassa } from './activite-massa.entity';
import {
  CreateActiviteMassaDto,
  UpdateActiviteMassaDto,
} from './activite-massa.dto';

@Controller('api/activite-massa')
export class ActiviteMassaController {
  constructor(private readonly activiteMassaService: ActiviteMassaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createActiviteMassaDto: CreateActiviteMassaDto,
  ): Promise<ActiviteMassa> {
    return this.activiteMassaService.create(createActiviteMassaDto);
  }

  @Get()
  async findAll(
    @Query('id_activite_type') id_activite_type?: string,
    @Query('programYear') programYear?: string,
  ): Promise<ActiviteMassa[]> {
    return this.activiteMassaService.findAll(
      id_activite_type ? +id_activite_type : undefined,
      programYear,
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActiviteMassa> {
    return this.activiteMassaService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActiviteMassaDto: UpdateActiviteMassaDto,
  ): Promise<ActiviteMassa> {
    return this.activiteMassaService.update(+id, updateActiviteMassaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.activiteMassaService.remove(+id);
  }
}
