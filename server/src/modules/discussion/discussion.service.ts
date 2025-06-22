import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discussion } from './discussion.entity';
import { CreateDiscussionDto, UpdateDiscussionDto } from './discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(
    @InjectRepository(Discussion)
    private readonly discussionRepository: Repository<Discussion>,
  ) {}

  async create(createDiscussionDto: CreateDiscussionDto): Promise<Discussion> {
    const discussion = this.discussionRepository.create(createDiscussionDto);
    return this.discussionRepository.save(discussion);
  }

  async findAll(): Promise<Discussion[]> {
    return this.discussionRepository.find({
      order: { date_discussion: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Discussion> {
    const discussion = await this.discussionRepository.findOne({
      where: { ID: id },
    });

    if (!discussion) {
      throw new NotFoundException(`Discussion with ID ${id} not found`);
    }

    return discussion;
  }

  async findByLeadId(leadId: number): Promise<Discussion[]> {
    return this.discussionRepository.find({
      where: { id_lead: leadId },
      order: { date_discussion: 'DESC' },
    });
  }

  async update(
    id: number,
    updateDiscussionDto: UpdateDiscussionDto,
  ): Promise<Discussion> {
    const discussion = await this.findOne(id);
    Object.assign(discussion, updateDiscussionDto);
    return this.discussionRepository.save(discussion);
  }

  async remove(id: number): Promise<void> {
    const discussion = await this.findOne(id);
    await this.discussionRepository.remove(discussion);
  }
}
