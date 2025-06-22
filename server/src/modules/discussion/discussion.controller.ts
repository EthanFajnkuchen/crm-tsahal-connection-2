import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DiscussionService } from './discussion.service';
import { Discussion } from './discussion.entity';
import { CreateDiscussionDto, UpdateDiscussionDto } from './discussion.dto';
import { Permissions } from './../../shared/decorators/permissions.decorator';

@Controller('api/discussions')
export class DiscussionController {
  constructor(private readonly discussionService: DiscussionService) {}

  @Post()
  @Permissions('write:data')
  async create(
    @Body() createDiscussionDto: CreateDiscussionDto,
  ): Promise<Discussion> {
    return this.discussionService.create(createDiscussionDto);
  }

  @Get()
  @Permissions('read:data')
  async findAll(): Promise<Discussion[]> {
    return this.discussionService.findAll();
  }

  @Get('lead/:leadId')
  @Permissions('read:data')
  async findByLeadId(@Param('leadId') leadId: string): Promise<Discussion[]> {
    return this.discussionService.findByLeadId(+leadId);
  }

  @Get(':id')
  @Permissions('read:data')
  async findOne(@Param('id') id: string): Promise<Discussion> {
    return this.discussionService.findOne(+id);
  }

  @Put(':id')
  @Permissions('write:data')
  async update(
    @Param('id') id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
  ): Promise<Discussion> {
    return this.discussionService.update(+id, updateDiscussionDto);
  }

  @Delete(':id')
  @Permissions('write:data')
  async remove(@Param('id') id: string): Promise<void> {
    return this.discussionService.remove(+id);
  }
}
