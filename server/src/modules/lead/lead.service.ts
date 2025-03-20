import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Brackets } from 'typeorm';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
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

  async getExpertCoStats(): Promise<{
    expertCoTotal: number;
    expertCoActuel: number;
  }> {
    try {
      const expertCoTotal = await this.leadRepository.count({
        where: { expertConnection: 'Oui' },
      });

      const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD

      const expertCoActuel = await this.leadRepository
        .createQueryBuilder('lead')
        .where('lead.expertConnection = :expertCo', { expertCo: 'Oui' })
        .andWhere(
          new Brackets((qb) => {
            qb.where('lead.giyusDate IS NULL')
              .orWhere('lead.giyusDate = ""')
              .orWhere('lead.giyusDate > :today', { today });
          }),
        )
        .getCount();

      return {
        expertCoTotal,
        expertCoActuel,
      };
    } catch (error) {
      throw new Error(
        `Failed to get expert connection stats: ${error.message}`,
      );
    }
  }

  async getProductStats(current: boolean): Promise<Record<string, number>> {
    const products = [
      'Suivi Massa',
      'Suivi Classique',
      'Suivi Expert',
      'Entretien individuel',
      'Simulation Tsav Rishon/Yom Hamea',
      'Evaluation physique & mentale',
      'Orientation individuelle sur les postes',
    ];

    const today = new Date().toISOString().split('T')[0]; // Format YYYY-MM-DD
    const stats: Record<string, number> = {};

    for (const product of products) {
      const query = this.leadRepository.createQueryBuilder('lead').where(
        `(lead.produitEC1 = :product OR lead.produitEC2 = :product OR 
                      lead.produitEC3 = :product OR lead.produitEC4 = :product OR 
                      lead.produitEC5 = :product)`,
        { product },
      );

      if (current) {
        query.andWhere(
          `(lead.giyusDate IS NULL OR lead.giyusDate = '' OR lead.giyusDate > :today)`,
          { today },
        );
      }

      stats[product.replace(/\s+/g, '') + (current ? 'Current' : 'Total')] =
        await query.getCount();
    }

    return stats;
  }

  async getStatsExpertCoByYear(): Promise<
    Record<string, Record<string, { massa: number; other: number }>>
  > {
    try {
      const dateFields = [
        'dateProduitEC1',
        'dateProduitEC2',
        'dateProduitEC3',
        'dateProduitEC4',
        'dateProduitEC5',
      ];

      const result: Record<
        string,
        Record<string, { massa: number; other: number }>
      > = {};

      for (const field of dateFields) {
        const query = this.leadRepository
          .createQueryBuilder('lead')
          .select([
            `EXTRACT(YEAR FROM lead.${field}) AS year`,
            `EXTRACT(MONTH FROM lead.${field}) AS month`,
            `SUM(CASE WHEN lead.produitEC1 = 'Suivi Massa' THEN 1 ELSE 0 END) AS massa`,
            `SUM(CASE WHEN lead.produitEC1 != 'Suivi Massa' THEN 1 ELSE 0 END) AS other`,
          ])
          .where(`lead.${field} IS NOT NULL`)
          .groupBy('year, month');

        const counts = await query.getRawMany();

        counts.forEach(({ year, month, massa, other }) => {
          if (!year || !month) return;

          const yearStr = year.toString();
          const monthStr = month.toString().padStart(2, '0');

          if (!result[yearStr]) {
            // Initialiser l'année avec tous les mois de 01 à 12
            result[yearStr] = Object.fromEntries(
              Array.from({ length: 12 }, (_, i) => [
                (i + 1).toString().padStart(2, '0'),
                { massa: 0, other: 0 },
              ]),
            );
          }

          result[yearStr][monthStr].massa += Number(massa);
          result[yearStr][monthStr].other += Number(other);
        });
      }

      // Tri des années et des mois
      const sortedResult = Object.keys(result)
        .sort()
        .reduce(
          (acc, year) => {
            acc[year] = Object.keys(result[year])
              .sort((a, b) => Number(a) - Number(b)) // Tri des mois dans l'ordre 01 → 12
              .reduce(
                (monthAcc, month) => {
                  monthAcc[month] = result[year][month];
                  return monthAcc;
                },
                {} as Record<string, { massa: number; other: number }>,
              );
            return acc;
          },
          {} as Record<
            string,
            Record<string, { massa: number; other: number }>
          >,
        );

      return sortedResult;
    } catch (error) {
      throw new Error(`Error retrieving stats: ${error.message}`);
    }
  }
}
