import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiviteMassa } from './activite-massa.entity';
import {
  CreateActiviteMassaDto,
  UpdateActiviteMassaDto,
} from './activite-massa.dto';

@Injectable()
export class ActiviteMassaService {
  constructor(
    @InjectRepository(ActiviteMassa)
    private readonly activiteMassaRepository: Repository<ActiviteMassa>,
  ) {}

  async create(
    createActiviteMassaDto: CreateActiviteMassaDto,
  ): Promise<ActiviteMassa> {
    const activiteMassa = this.activiteMassaRepository.create(
      createActiviteMassaDto,
    );
    return this.activiteMassaRepository.save(activiteMassa);
  }

  async findAll(
    id_activite_type?: number,
    programYear?: string,
    date?: string,
  ): Promise<ActiviteMassa[]> {
    const queryBuilder = this.activiteMassaRepository
      .createQueryBuilder('activiteMassa')
      .orderBy('activiteMassa.id', 'DESC');

    if (id_activite_type) {
      queryBuilder.where('activiteMassa.id_activite_type = :id_activite_type', {
        id_activite_type,
      });
    }

    if (programYear) {
      queryBuilder.andWhere('activiteMassa.programYear = :programYear', {
        programYear,
      });
    }

    if (date) {
      queryBuilder.andWhere('DATE(activiteMassa.date) = :date', {
        date,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<ActiviteMassa> {
    const activiteMassa = await this.activiteMassaRepository.findOne({
      where: { id },
    });

    if (!activiteMassa) {
      throw new NotFoundException(`ActiviteMassa with ID ${id} not found`);
    }

    return activiteMassa;
  }

  async update(
    id: number,
    updateActiviteMassaDto: UpdateActiviteMassaDto,
  ): Promise<ActiviteMassa> {
    const activiteMassa = await this.findOne(id);

    Object.assign(activiteMassa, updateActiviteMassaDto);

    return this.activiteMassaRepository.save(activiteMassa);
  }

  async remove(id: number): Promise<void> {
    const activiteMassa = await this.findOne(id);
    await this.activiteMassaRepository.remove(activiteMassa);
  }
}
