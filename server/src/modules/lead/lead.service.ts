import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
  ) {}

  async getLeads(limit?: number): Promise<Lead[]> {
    const queryBuilder = this.leadRepository
      .createQueryBuilder('lead')
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
}
