import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiviteMassaParticipation } from './activite-massa-participation.entity';
import {
  CreateActiviteMassaParticipationDto,
  UpdateActiviteMassaParticipationDto,
} from './activite-massa-participation.dto';

@Injectable()
export class ActiviteMassaParticipationService {
  constructor(
    @InjectRepository(ActiviteMassaParticipation)
    private readonly activiteMassaParticipationRepository: Repository<ActiviteMassaParticipation>,
  ) {}

  async create(
    createActiviteMassaParticipationDto: CreateActiviteMassaParticipationDto,
  ): Promise<ActiviteMassaParticipation> {
    const activiteMassaParticipation =
      this.activiteMassaParticipationRepository.create(
        createActiviteMassaParticipationDto,
      );
    return this.activiteMassaParticipationRepository.save(
      activiteMassaParticipation,
    );
  }

  async findAll(
    id_activite_massa?: number,
    lead_id?: number,
  ): Promise<ActiviteMassaParticipation[]> {
    const queryBuilder = this.activiteMassaParticipationRepository
      .createQueryBuilder('activiteMassaParticipation')
      .leftJoinAndSelect(
        'activiteMassaParticipation.activiteMassa',
        'activiteMassa',
      )
      .leftJoinAndSelect('activiteMassaParticipation.lead', 'lead')
      .orderBy('activiteMassaParticipation.id', 'DESC');

    if (id_activite_massa) {
      queryBuilder.where(
        'activiteMassaParticipation.id_activite_massa = :id_activite_massa',
        {
          id_activite_massa,
        },
      );
    }

    if (lead_id) {
      queryBuilder.andWhere('activiteMassaParticipation.lead_id = :lead_id', {
        lead_id,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<ActiviteMassaParticipation> {
    const activiteMassaParticipation =
      await this.activiteMassaParticipationRepository.findOne({
        where: { id },
        relations: ['activiteMassa', 'lead'],
      });

    if (!activiteMassaParticipation) {
      throw new NotFoundException(
        `ActiviteMassaParticipation with ID ${id} not found`,
      );
    }

    return activiteMassaParticipation;
  }

  async update(
    id: number,
    updateActiviteMassaParticipationDto: UpdateActiviteMassaParticipationDto,
  ): Promise<ActiviteMassaParticipation> {
    const activiteMassaParticipation = await this.findOne(id);

    Object.assign(
      activiteMassaParticipation,
      updateActiviteMassaParticipationDto,
    );

    return this.activiteMassaParticipationRepository.save(
      activiteMassaParticipation,
    );
  }

  async remove(id: number): Promise<void> {
    const activiteMassaParticipation = await this.findOne(id);
    await this.activiteMassaParticipationRepository.remove(
      activiteMassaParticipation,
    );
  }

  async findByActiviteMassa(
    id_activite_massa: number,
  ): Promise<ActiviteMassaParticipation[]> {
    return this.activiteMassaParticipationRepository.find({
      where: { id_activite_massa },
      relations: ['lead'],
    });
  }

  async findByLead(lead_id: number): Promise<ActiviteMassaParticipation[]> {
    return this.activiteMassaParticipationRepository.find({
      where: { lead_id },
      relations: ['activiteMassa'],
    });
  }
}
