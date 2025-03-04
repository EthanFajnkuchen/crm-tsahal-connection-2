import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
import { FindManyOptions } from 'typeorm';
import { LeadFilterDto } from './lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async getLeads(limit?: number): Promise<Partial<Lead>[]> {
    const queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
      .select([
        'lead.dateInscription',
        'lead.firstName',
        'lead.lastName',
        'lead.statutCandidat',
      ])
      .orderBy('lead.dateInscription', 'DESC');

    if (limit) {
      queryBuilder.limit(limit);
    }

    return queryBuilder.getMany();
  }

  async getStatistics(): Promise<LeadStatistics> {
    try {
      const totalLeads = await this.leadRepository.count();
      const toTreat = await this.leadRepository.count({
        where: { statutCandidat: 'À traiter' },
      });
      const inProgress = await this.leadRepository.count({
        where: { statutCandidat: 'En cours de traitement' },
      });
      const soldierMichveAlon = await this.leadRepository.count({
        where: { currentStatus: 'Un soldat - Michve Alon' },
      });
      const soldierUnit = await this.leadRepository.count({
        where: { currentStatus: 'Un soldat - unité' },
      });
      const soldierReleased = await this.leadRepository.count({
        where: { currentStatus: 'Un soldat libéré' },
      });
      const noResponse = await this.leadRepository.count({
        where: { statutCandidat: 'Ne repond pas/Ne sait pas' },
      });
      const exemptionOrAbandon = await this.leadRepository.count({
        where: [
          { currentStatus: 'Abandon avant le service' },
          { currentStatus: 'Exemption medicale' },
          { currentStatus: 'Exemption religieuse' },
          { currentStatus: 'Exemption (Autre)' },
        ],
      });
      const abandonDuringService = await this.leadRepository.count({
        where: { currentStatus: 'Abandon pendant le service' },
      });
      const inIsraelNoFramework = await this.leadRepository.count({
        where: { currentStatus: 'En Israel (sans cadre)' },
      });
      const outsideIsrael = await this.leadRepository.count({
        where: { currentStatus: `Hors d'Israel` },
      });
      const postBacProgram = await this.leadRepository.count({
        where: { currentStatus: 'Programme post-BAC' },
      });
      const preArmyProgram = await this.leadRepository.count({
        where: { currentStatus: 'Programme Pré-Armée' },
      });
      const youdAleph = await this.leadRepository.count({
        where: { currentStatus: 'Youd Alef' },
      });
      const youdBeth = await this.leadRepository.count({
        where: { currentStatus: 'Youd Beth' },
      });
      const toarRishonIsraeli = await this.leadRepository.count({
        where: { currentStatus: 'Toar Rishon/Handsai (Israélien)' },
      });
      const toarRishonTourist = await this.leadRepository.count({
        where: { currentStatus: 'Toar Rishon/Handsai (Touriste)' },
      });

      return {
        totalLeads,
        toTreat,
        inProgress,
        soldierMichveAlon,
        soldierUnit,
        soldierReleased,
        noResponse,
        exemptionOrAbandon,
        abandonDuringService,
        inIsraelNoFramework,
        outsideIsrael,
        postBacProgram,
        preArmyProgram,
        youdAleph,
        youdBeth,
        toarRishonIsraeli,
        toarRishonTourist,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getLeadsPerMonth(): Promise<Record<string, number>> {
    try {
      const today = new Date();
      const startDate = new Date(today.getFullYear(), today.getMonth() - 12, 1);
      startDate.setDate(startDate.getDate() + 1);
      const leads = await this.leadRepository
        .createQueryBuilder('lead')
        .select("DATE_FORMAT(lead.dateInscription, '%Y-%m')", 'month')
        .addSelect('COUNT(lead.ID)', 'lead_count')
        .where('lead.dateInscription >= :startDate', {
          startDate: startDate.toISOString().slice(0, 10),
        })
        .groupBy('month')
        .orderBy('month', 'ASC')
        .getRawMany();

      const monthlyCounts: Record<string, number> = {};
      for (let i = 12; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        date.setDate(date.getDate() + 1);
        const month = date.toISOString().slice(0, 7);
        monthlyCounts[month] = 0;
      }

      leads.forEach((lead) => {
        if (monthlyCounts.hasOwnProperty(lead.month)) {
          monthlyCounts[lead.month] = parseInt(lead.lead_count, 10);
        }
      });

      return monthlyCounts;
    } catch (error) {
      throw new Error(`Failed to get leads per month: ${error.message}`);
    }
  }

  async getLeadsPerYear(): Promise<Record<string, number>> {
    try {
      const result = await this.leadRepository
        .createQueryBuilder('lead')
        .select('SUBSTR(lead.dateInscription, 1, 4)', 'year')
        .addSelect('COUNT(lead.ID)', 'lead_count')
        .groupBy('year')
        .orderBy('year', 'ASC')
        .getRawMany();

      return result.reduce((acc, row) => {
        acc[row.year] = parseInt(row.lead_count, 10);
        return acc;
      }, {});
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getLeadsWithFilters(filters: LeadFilterDto): Promise<Partial<Lead>[]> {
    const { included, excluded, fieldsToSend } = filters;

    let query = this.leadRepository.createQueryBuilder('lead');

    if (included) {
      Object.keys(included).forEach((field) => {
        query = query.andWhere(`lead.${field} IN (:...values)`, {
          values: included[field],
        });
      });
    }
    if (excluded) {
      for (const field of Object.keys(excluded)) {
        const values = excluded[field];
        if (values.length > 0) {
          const existingValues = await this.leadRepository
            .createQueryBuilder('lead')
            .select(`DISTINCT lead.${field}`, 'value')
            .where(`lead.${field} IN (:...values)`, { values })
            .getRawMany();

          const validValues = existingValues.map((v) => v.value);

          if (validValues.length > 0) {
            query = query.andWhere(`lead.${field} NOT IN (:...validValues)`, {
              validValues,
            });
          }
        }
      }
    }

    if (fieldsToSend && fieldsToSend.length > 0) {
      const selectedFields = fieldsToSend.map((field) => `lead.${field}`);
      query = query.select(selectedFields);
    }

    return query.getRawMany();
  }

  async searchLeads(searchInput: string): Promise<Partial<Lead>[]> {
    try {
      if (!searchInput) {
        throw new Error('Search input is required');
      }

      const searchWords = searchInput.toLowerCase().split(/\s+/);

      let query = this.leadRepository.createQueryBuilder('lead');

      searchWords.forEach((word, index) => {
        const searchQuery = `%${word}%`;

        if (index === 0) {
          query = query.where(
            `(LOWER(lead.firstName) LIKE :searchQuery${index} 
          OR LOWER(lead.lastName) LIKE :searchQuery${index} 
          OR LOWER(CONCAT(lead.firstName, ' ', lead.lastName)) LIKE :searchQuery${index})`,
            { [`searchQuery${index}`]: searchQuery },
          );
        } else {
          query = query.andWhere(
            `(LOWER(lead.firstName) LIKE :searchQuery${index} 
          OR LOWER(lead.lastName) LIKE :searchQuery${index} 
          OR LOWER(CONCAT(lead.firstName, ' ', lead.lastName)) LIKE :searchQuery${index})`,
            { [`searchQuery${index}`]: searchQuery },
          );
        }
      });
      
      query = query.orderBy('lead.dateInscription', 'DESC');

      const leads = await query.getMany();

      return leads.map((lead) => ({
        ID: lead.ID,
        firstName: lead.firstName,
        lastName: lead.lastName,
        dateInscription: lead.dateInscription,
        statutCandidat: lead.statutCandidat,
      }));
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }
}
