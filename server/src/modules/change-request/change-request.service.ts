import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRequest } from './change-request.entity';
import {
  CreateChangeRequestDto,
  UpdateChangeRequestDto,
} from './change-request.dto';

@Injectable()
export class ChangeRequestService {
  constructor(
    @InjectRepository(ChangeRequest)
    private readonly changeRequestRepository: Repository<ChangeRequest>,
  ) {}

  async create(
    createChangeRequestDto: CreateChangeRequestDto,
  ): Promise<ChangeRequest> {
    console.log(createChangeRequestDto);
    const changeRequest = this.changeRequestRepository.create(
      createChangeRequestDto,
    );
    return this.changeRequestRepository.save(changeRequest);
  }

  async findAll(): Promise<ChangeRequest[]> {
    return this.changeRequestRepository.find({
      relations: ['lead'],
      order: { id: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ChangeRequest> {
    const changeRequest = await this.changeRequestRepository.findOne({
      where: { id },
      relations: ['lead'],
    });

    if (!changeRequest) {
      throw new NotFoundException(`Change request with ID ${id} not found`);
    }

    return changeRequest;
  }

  async findByLeadId(leadId: number): Promise<ChangeRequest[]> {
    return this.changeRequestRepository.find({
      where: { leadId },
      relations: ['lead'],
      order: { dateModified: 'DESC' },
    });
  }

  async update(
    id: number,
    updateChangeRequestDto: UpdateChangeRequestDto,
  ): Promise<ChangeRequest> {
    const changeRequest = await this.findOne(id);
    Object.assign(changeRequest, updateChangeRequestDto);
    return this.changeRequestRepository.save(changeRequest);
  }

  async remove(id: number): Promise<void> {
    const changeRequest = await this.findOne(id);
    await this.changeRequestRepository.remove(changeRequest);
  }
}
