import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './activity.entity';
import { CreateActivityDto, UpdateActivityDto } from './activity.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    const activity = this.activityRepository.create(createActivityDto);
    return this.activityRepository.save(activity);
  }

  async findAll(category?: string): Promise<Activity[]> {
    const queryBuilder = this.activityRepository
      .createQueryBuilder('activity')
      .orderBy('activity.date', 'DESC');

    if (category) {
      queryBuilder.where('activity.category = :category', { category });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<Activity> {
    const activity = await this.activityRepository.findOne({
      where: { id },
    });

    if (!activity) {
      throw new NotFoundException(`Activity with ID ${id} not found`);
    }

    return activity;
  }

  async update(
    id: number,
    updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    const activity = await this.findOne(id);

    Object.assign(activity, updateActivityDto);

    return this.activityRepository.save(activity);
  }

  async remove(id: number): Promise<void> {
    const activity = await this.findOne(id);
    await this.activityRepository.remove(activity);
  }
}
