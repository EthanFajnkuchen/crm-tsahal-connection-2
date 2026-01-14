import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequest } from './change-request.entity';
import { Lead } from '../lead/lead.entity';
import {
  CreateChangeRequestDto,
  UpdateChangeRequestDto,
} from './change-request.dto';
import { Permissions } from './../../shared/decorators/permissions.decorator';

@Controller('api/change-requests')
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) {}

  @Post()
  // @Permissions('write:data')
  async create(
    @Body() createChangeRequestDto: CreateChangeRequestDto,
  ): Promise<ChangeRequest> {
    return this.changeRequestService.create(createChangeRequestDto);
  }

  @Get()
  // @Permissions('read:data')
  async findAll(): Promise<ChangeRequest[]> {
    return this.changeRequestService.findAll();
  }

  @Get('grouped/by-lead')
  @Permissions('read:data')
  async findAllGroupedByLead(): Promise<
    Array<{
      leadId: number;
      lead: Lead;
      requests: ChangeRequest[];
      totalCount: number;
      volunteers: string[];
    }>
  > {
    return this.changeRequestService.findAllGroupedByLead();
  }

  @Get('lead/:leadId')
  @Permissions('read:data')
  async findByLeadId(
    @Param('leadId') leadId: string,
  ): Promise<ChangeRequest[]> {
    return this.changeRequestService.findByLeadId(+leadId);
  }

  @Get(':id')
  @Permissions('read:data')
  async findOne(@Param('id') id: string): Promise<ChangeRequest> {
    return this.changeRequestService.findOne(+id);
  }

  @Put(':id')
  @Permissions('write:data')
  async update(
    @Param('id') id: string,
    @Body() updateChangeRequestDto: UpdateChangeRequestDto,
  ): Promise<ChangeRequest> {
    return this.changeRequestService.update(+id, updateChangeRequestDto);
  }

  @Delete(':id')
  @Permissions('write:data')
  async remove(@Param('id') id: string): Promise<void> {
    return this.changeRequestService.remove(+id);
  }
}
