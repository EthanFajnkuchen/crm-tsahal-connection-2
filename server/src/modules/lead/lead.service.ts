import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  StreamableFile,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Brackets, Not, IsNull } from 'typeorm';
import { Lead } from './lead.entity';
import { LeadStatistics } from './type';
import { LeadFilterDto, UpdateLeadDto } from './lead.dto';
import { PassThrough } from 'stream';
import { Workbook } from 'exceljs';
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
        'lead.ID',
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

      const sortedResult = Object.keys(result)
        .sort()
        .reduce(
          (acc, year) => {
            acc[year] = Object.keys(result[year])
              .sort((a, b) => Number(a) - Number(b))
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

  async getMahzorGiyusCounts(): Promise<any> {
    try {
      const leads = await this.leadRepository.find({
        where: {
          mahzorGiyus: Not(IsNull()),
          typeGiyus: Not(IsNull()),
        },
      });

      const results: Record<string, any> = {};

      for (const lead of leads) {
        const mahzorParts = lead.mahzorGiyus.split(' ');
        if (mahzorParts.length < 2) continue;

        const year = mahzorParts[1];
        const period = lead.mahzorGiyus;
        const typeGiyus = lead.typeGiyus;

        let key: string;
        if (typeGiyus === 'Olim/Hesder') {
          key = `${period} - Olim / Mahal Hesder`;
        } else if (typeGiyus === 'Mahal Nahal / Mahal Haredi') {
          key = `${period} - Mahal Nahal / Mahal Haredi`;
        } else {
          continue;
        }

        const yearKey = `Mahzor Giyus ${year}`;
        if (!results[yearKey]) {
          results[yearKey] = {};
        }
        if (!results[yearKey][key]) {
          results[yearKey][key] = { count: 0, leads: [] };
        }

        results[yearKey][key].count += 1;
        results[yearKey][key].leads.push({
          firstName: lead.firstName,
          lastName: lead.lastName,
          expertConnection: lead.expertConnection,
          gender: lead.gender,
          statutCandidat: lead.statutCandidat,
          giyusDate: lead.giyusDate,
          dateFinService: lead.dateFinService,
          nomPoste: lead.nomPoste,
          email: lead.email,
        });
      }

      const sortedResults = Object.keys(results)
        .sort(
          (a, b) => parseInt(b.split(' ').pop()) - parseInt(a.split(' ').pop()),
        )
        .reduce((acc, key) => {
          acc[key] = results[key];
          return acc;
        }, {});

      return sortedResults;
    } catch (error) {
      throw new Error(
        `Failed to retrieve Mahzor Giyus counts: ${error.message}`,
      );
    }
  }

  async downloadLeads(): Promise<StreamableFile> {
    try {
      const leads = await this.leadRepository.find();

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Data Soldats');

      const columns = [
        { header: 'ID', key: 'ID' },
        { header: "Date d'inscription", key: 'dateInscription' },
        { header: 'Statut du Candidat', key: 'statutCandidat' },
        { header: 'Mahzor Giyus', key: 'mahzorGiyus' },
        { header: 'Type Giyus', key: 'typeGiyus' },
        { header: 'Pikoud', key: 'pikoud' },
        { header: 'Date de shirhour', key: 'dateFinService' },
        { header: 'Type de Poste', key: 'typePoste' },
        { header: 'Nom du Poste', key: 'nomPoste' },
        { header: 'Expert Connection', key: 'expertConnection' },
        { header: 'Produit EC1', key: 'produitEC1' },
        { header: 'Produit EC2', key: 'produitEC2' },
        { header: 'Produit EC3', key: 'produitEC3' },
        { header: 'Produit EC4', key: 'produitEC4' },
        { header: 'Produit EC5', key: 'produitEC5' },
        { header: 'Date Produit EC1', key: 'dateProduitEC1' },
        { header: 'Date Produit EC2', key: 'dateProduitEC2' },
        { header: 'Date Produit EC3', key: 'dateProduitEC3' },
        { header: 'Date Produit EC4', key: 'dateProduitEC4' },
        { header: 'Date Produit EC5', key: 'dateProduitEC5' },
        { header: 'Prénom', key: 'firstName' },
        { header: 'Nom', key: 'lastName' },
        { header: 'Date de naissance', key: 'birthDate' },
        { header: 'Genre', key: 'gender' },
        { header: 'Email', key: 'email' },
        { header: 'Numero de téléphone', key: 'phoneNumber' },
        { header: 'Possède un numero Whatsapp ?', key: 'isWhatsAppSame' },
        { header: 'Numéro Whatsapp', key: 'whatsappNumber' },
        { header: 'Ville', key: 'city' },
        { header: 'Enfant Unique ?', key: 'isOnlyChild' },
        { header: "Contact d'urgence - Prénom", key: 'contactUrgenceLastName' },
        { header: "Contact d'urgence - Nom", key: 'contactUrgenceFirstName' },
        {
          header: "Contact d'urgence - Numero",
          key: 'contactUrgencePhoneNumber',
        },
        { header: "Contact d'urgence - Email", key: 'contactUrgenceMail' },
        { header: "Contact d'urgence - Lien", key: 'contactUrgenceRelation' },
        { header: 'Statut loi du retour', key: 'StatutLoiRetour' },
        { header: 'Date de conversion', key: 'conversionDate' },
        { header: 'Agence de conversion', key: 'conversionAgency' },
        { header: 'Statut de résident', key: 'statutResidentIsrael' },
        { header: "Année d'Alyah", key: 'anneeAlyah' },
        { header: 'Nombre de nationalitées', key: 'numberOfNationalities' },
        { header: 'Nationalité 1', key: 'nationality1' },
        { header: 'Passeport Nationalité 1', key: 'passportNumber1' },
        { header: 'Nationalité 2', key: 'nationality2' },
        { header: 'Passeport Nationalité 2', key: 'passportNumber2' },
        { header: 'Nationalité 3', key: 'nationality3' },
        { header: 'Passeport Nationalité 3', key: 'passportNumber3' },
        { header: 'Possède un ID israelien ?', key: 'hasIsraeliID' },
        { header: 'Teoudat Zeout', key: 'israeliIDNumber' },
        { header: 'Possède le BAC', key: 'bacObtention' },
        { header: 'Pays du BAC', key: 'bacCountry' },
        { header: 'Type de BAC', key: 'bacType' },
        { header: 'Ecole du BAC en Israel', key: 'israeliBacSchool' },
        {
          header: 'Ecole francaise du BAC en Israel',
          key: 'frenchBacSchoolIsrael',
        },
        { header: "Nom de l'école (Autre)", key: 'otherSchoolName' },
        { header: 'Cursus en école juive ?', key: 'jewishSchool' },
        { header: 'Ecole du BAC en France', key: 'frenchBacSchoolFrance' },
        { header: 'Possède un diplome academique', key: 'academicDiploma' },
        { header: 'Pays du Diplome', key: 'higherEducationCountry' },
        {
          header: "Nom de l'université en hébreu",
          key: 'universityNameHebrew',
        },
        { header: 'No, du diplome en hébreu', key: 'diplomaNameHebrew' },
        {
          header: "Nom de  l'université en francais",
          key: 'universityNameFrench',
        },
        { header: 'Nom du diplone en francais', key: 'diplomaNameFrench' },
        { header: "Age d'arrivée en Israel", key: 'arrivalAge' },
        {
          header: 'Participation a un programme pré-armée',
          key: 'programParticipation',
        },
        { header: 'Nom du programme pré-armée', key: 'programName' },
        { header: 'Année scolaire', key: 'schoolYears' },
        {
          header: 'Participation a un programme de Dhyat Giyus',
          key: 'armyDeferralProgram',
        },
        {
          header: 'Nom du programme de Dhyat Giyus',
          key: 'programNameHebrewArmyDeferral',
        },
        { header: 'Je suis actuellement', key: 'currentStatus' },
        { header: 'Soldat Seul', key: 'soldierAloneStatus' },
        { header: 'Type de service', key: 'serviceType' },
        { header: 'Parcours Mahal', key: 'mahalPath' },
        { header: "Parcours d'études", key: 'studyPath' },
        { header: 'Tsav Rishon', key: 'tsavRishonStatus' },
        { header: 'Centre de recrutement', key: 'recruitmentCenter' },
        { header: 'Date du Tsav Rishon', key: 'tsavRishonDate' },
        {
          header: 'Notes du Tsav Rishon reçu ?',
          key: 'tsavRishonGradesReceived',
        },
        { header: 'Dapar', key: 'daparNote' },
        { header: 'Profile', key: 'medicalProfile' },
        { header: 'Simoul Ivrit', key: 'hebrewScore' },
        { header: 'Yom Hamea', key: 'yomHameaStatus' },
        { header: 'Date du Yom Hameah', key: 'yomHameaDate' },
        { header: 'Yom Sayerot', key: 'yomSayerotStatus' },
        { header: 'Date du Yom Sayerot', key: 'yomSayerotDate' },
        { header: 'Giyus', key: 'armyEntryDateStatus' },
        { header: 'Date de giyus', key: 'giyusDate' },
        { header: 'Programme Michve-Alon', key: 'michveAlonTraining' },
      ];

      worksheet.columns = columns;

      for (const lead of leads) {
        worksheet.addRow(lead);
      }

      const stream = new PassThrough();
      await workbook.xlsx.write(stream);
      stream.end();

      return new StreamableFile(stream, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        disposition: 'attachment; filename="leads.xlsx"',
      });
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLeadById(leadId: string) {
    if (!leadId) {
      throw new BadRequestException('ID is required');
    }

    try {
      const lead = await this.leadRepository.findOne({
        where: { ID: parseInt(leadId) },
      });

      if (!lead) {
        throw new NotFoundException('Lead not found');
      }

      const leadData = {
        ID: lead.ID,
        dateInscription: lead.dateInscription,
        statutCandidat: lead.statutCandidat,
        mahzorGiyus: lead.mahzorGiyus,
        typeGiyus: lead.typeGiyus,
        pikoud: lead.pikoud,
        dateFinService: lead.dateFinService,
        typePoste: lead.typePoste,
        nomPoste: lead.nomPoste,
        expertConnection: lead.expertConnection,
        produitEC1: lead.produitEC1,
        produitEC2: lead.produitEC2,
        produitEC3: lead.produitEC3,
        produitEC4: lead.produitEC4,
        produitEC5: lead.produitEC5,
        firstName: lead.firstName,
        lastName: lead.lastName,
        birthDate: lead.birthDate,
        gender: lead.gender,
        email: lead.email,
        phoneNumber: lead.phoneNumber,
        isWhatsAppSame: lead.isWhatsAppSame,
        whatsappNumber: lead.whatsappNumber,
        city: lead.city,
        isOnlyChild: lead.isOnlyChild,
        contactUrgenceLastName: lead.contactUrgenceLastName,
        contactUrgenceFirstName: lead.contactUrgenceFirstName,
        contactUrgencePhoneNumber: lead.contactUrgencePhoneNumber,
        contactUrgenceMail: lead.contactUrgenceMail,
        contactUrgenceRelation: lead.contactUrgenceRelation,
        StatutLoiRetour: lead.StatutLoiRetour,
        conversionDate: lead.conversionDate,
        conversionAgency: lead.conversionAgency,
        statutResidentIsrael: lead.statutResidentIsrael,
        anneeAlyah: lead.anneeAlyah,
        numberOfNationalities: lead.numberOfNationalities,
        nationality1: lead.nationality1,
        passportNumber1: lead.passportNumber1,
        nationality2: lead.nationality2,
        passportNumber2: lead.passportNumber2,
        nationality3: lead.nationality3,
        passportNumber3: lead.passportNumber3,
        hasIsraeliID: lead.hasIsraeliID,
        israeliIDNumber: lead.israeliIDNumber,
        bacObtention: lead.bacObtention,
        bacCountry: lead.bacCountry,
        bacType: lead.bacType,
        israeliBacSchool: lead.israeliBacSchool,
        frenchBacSchoolIsrael: lead.frenchBacSchoolIsrael,
        otherSchoolName: lead.otherSchoolName,
        jewishSchool: lead.jewishSchool,
        frenchBacSchoolFrance: lead.frenchBacSchoolFrance,
        academicDiploma: lead.academicDiploma,
        higherEducationCountry: lead.higherEducationCountry,
        universityNameHebrew: lead.universityNameHebrew,
        diplomaNameHebrew: lead.diplomaNameHebrew,
        universityNameFrench: lead.universityNameFrench,
        diplomaNameFrench: lead.diplomaNameFrench,
        arrivalAge: lead.arrivalAge,
        programParticipation: lead.programParticipation,
        programName: lead.programName,
        schoolYears: lead.schoolYears,
        armyDeferralProgram: lead.armyDeferralProgram,
        programNameHebrewArmyDeferral: lead.programNameHebrewArmyDeferral,
        currentStatus: lead.currentStatus,
        soldierAloneStatus: lead.soldierAloneStatus,
        serviceType: lead.serviceType,
        mahalPath: lead.mahalPath,
        studyPath: lead.studyPath,
        tsavRishonStatus: lead.tsavRishonStatus,
        recruitmentCenter: lead.recruitmentCenter,
        tsavRishonDate: lead.tsavRishonDate,
        tsavRishonGradesReceived: lead.tsavRishonGradesReceived,
        daparNote: lead.daparNote,
        medicalProfile: lead.medicalProfile,
        hebrewScore: lead.hebrewScore,
        yomHameaStatus: lead.yomHameaStatus,
        yomHameaDate: lead.yomHameaDate,
        yomSayerotStatus: lead.yomSayerotStatus,
        yomSayerotDate: lead.yomSayerotDate,
        armyEntryDateStatus: lead.armyEntryDateStatus,
        giyusDate: lead.giyusDate,
        michveAlonTraining: lead.michveAlonTraining,
        summary: lead.summary,
        dateProduitEC1: lead.dateProduitEC1,
        dateProduitEC2: lead.dateProduitEC2,
        dateProduitEC3: lead.dateProduitEC3,
        dateProduitEC4: lead.dateProduitEC4,
        dateProduitEC5: lead.dateProduitEC5,
      };

      return leadData;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async updateLead(leadId: string, updateData: UpdateLeadDto): Promise<Lead> {
    if (!leadId) {
      throw new BadRequestException('ID is required');
    }

    try {
      const existingLead = await this.leadRepository.findOne({
        where: { ID: parseInt(leadId) },
      });

      if (!existingLead) {
        throw new NotFoundException('Lead not found');
      }

      // Appliquer les mises à jour
      Object.assign(existingLead, updateData);

      // Sauvegarder les modifications
      const updatedLead = await this.leadRepository.save(existingLead);

      return updatedLead;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Failed to update lead: ${error.message}`,
      );
    }
  }
}
