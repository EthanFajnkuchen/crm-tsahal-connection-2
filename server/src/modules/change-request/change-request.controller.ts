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
import {
  CreateChangeRequestDto,
  UpdateChangeRequestDto,
} from './change-request.dto';
import { Permissions } from './../../shared/decorators/permissions.decorator';

@Controller('api/change-requests')
export class ChangeRequestController {
  constructor(private readonly changeRequestService: ChangeRequestService) {}

  @Post()
  @Permissions('write:data')
  async create(
    @Body() createChangeRequestDto: CreateChangeRequestDto,
  ): Promise<ChangeRequest> {
    return this.changeRequestService.create(createChangeRequestDto);
  }

  @Get()
  @Permissions('read:data')
  async findAll(): Promise<ChangeRequest[]> {
    return this.changeRequestService.findAll();
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
