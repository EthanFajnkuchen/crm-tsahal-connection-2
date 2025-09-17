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
import { ActiviteConfService } from './activite-conf.service';
import { ActiviteConf } from './activite-conf.entity';
import {
  CreateActiviteConfDto,
  UpdateActiviteConfDto,
  ActiviteConfFilterDto,
} from './activite-conf.dto';

@Controller('api/activite-conf')
export class ActiviteConfController {
  constructor(private readonly activiteConfService: ActiviteConfService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createActiviteConfDto: CreateActiviteConfDto,
  ): Promise<ActiviteConf> {
    return this.activiteConfService.create(createActiviteConfDto);
  }

  @Get()
  async findAll(
    @Query('activiteType') activiteType?: string,
    @Query('lead_id') lead_id?: string,
    @Query('isFuturSoldier') isFuturSoldier?: string,
    @Query('hasArrived') hasArrived?: string,
  ): Promise<ActiviteConf[]> {
    const filter: ActiviteConfFilterDto = {};

    if (activiteType) filter.activiteType = +activiteType;
    if (lead_id) filter.lead_id = +lead_id;
    if (isFuturSoldier) filter.isFuturSoldier = isFuturSoldier === 'true';
    if (hasArrived) filter.hasArrived = hasArrived === 'true';

    return this.activiteConfService.findAll(filter);
  }

  @Get('statistics')
  async getStatistics() {
    return this.activiteConfService.getStatistics();
  }

  @Get('by-lead/:leadId')
  async findByLeadId(@Param('leadId') leadId: string): Promise<ActiviteConf[]> {
    return this.activiteConfService.findByLeadId(+leadId);
  }

  @Get('by-activite-type/:activiteType')
  async findByActiviteType(
    @Param('activiteType') activiteType: string,
  ): Promise<ActiviteConf[]> {
    return this.activiteConfService.findByActiviteType(+activiteType);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ActiviteConf> {
    return this.activiteConfService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActiviteConfDto: UpdateActiviteConfDto,
  ): Promise<ActiviteConf> {
    return this.activiteConfService.update(+id, updateActiviteConfDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.activiteConfService.remove(+id);
  }
}
