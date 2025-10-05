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
import { ActivityService } from './activity.service';
import { Activity } from './activity.entity';
import { CreateActivityDto, UpdateActivityDto } from './activity.dto';

@Controller('api/activities')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    return this.activityService.create(createActivityDto);
  }

  @Get()
  async findAll(@Query('category') category?: string): Promise<Activity[]> {
    return this.activityService.findAll(category);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Activity> {
    return this.activityService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    return this.activityService.update(+id, updateActivityDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.activityService.remove(+id);
  }
}
