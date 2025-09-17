import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActiviteConf } from './activite-conf.entity';
import {
  CreateActiviteConfDto,
  UpdateActiviteConfDto,
  ActiviteConfFilterDto,
} from './activite-conf.dto';
import { MailService } from '../mail/mail.service';
import { ActivityService } from '../activity/activity.service';

@Injectable()
export class ActiviteConfService {
  private readonly logger = new Logger(ActiviteConfService.name);

  constructor(
    @InjectRepository(ActiviteConf)
    private readonly activiteConfRepository: Repository<ActiviteConf>,
    private readonly mailService: MailService,
    private readonly activityService: ActivityService,
  ) {}

  async create(
    createActiviteConfDto: CreateActiviteConfDto,
  ): Promise<ActiviteConf> {
    const activiteConf = this.activiteConfRepository.create(
      createActiviteConfDto,
    );
    const savedActiviteConf =
      await this.activiteConfRepository.save(activiteConf);

    // Envoyer l'email de confirmation en arrière-plan (ne pas bloquer la réponse)
    this.sendConfirmationEmailAsync(savedActiviteConf);

    return savedActiviteConf;
  }

  private async sendConfirmationEmailAsync(
    activiteConf: ActiviteConf,
  ): Promise<void> {
    try {
      // Récupérer les détails de l'activité
      const activity = await this.activityService.findOne(
        activiteConf.activiteType,
      );

      if (!activity) {
        this.logger.warn(
          `Activity with ID ${activiteConf.activiteType} not found, skipping email confirmation`,
        );
        return;
      }

      const participantName = `${activiteConf.firstName} ${activiteConf.lastName}`;

      // Envoyer l'email de confirmation
      await this.mailService.sendActivityConfirmationEmail(
        activiteConf.mail,
        participantName,
        activity.name,
        activity.date,
      );

      this.logger.log(
        `Confirmation email sent successfully to ${activiteConf.mail} for activity: ${activity.name}`,
      );
    } catch (error) {
      // Ne pas faire échouer la création si l'email échoue
      this.logger.error(
        `Failed to send confirmation email for participant ${activiteConf.firstName} ${activiteConf.lastName}`,
        error.stack,
      );
    }
  }

  async findAll(filter?: ActiviteConfFilterDto): Promise<ActiviteConf[]> {
    const queryBuilder = this.activiteConfRepository
      .createQueryBuilder('activiteConf')
      .orderBy('activiteConf.id', 'DESC');

    if (filter?.activiteType) {
      queryBuilder.andWhere('activiteConf.activiteType = :activiteType', {
        activiteType: filter.activiteType,
      });
    }

    if (filter?.lead_id) {
      queryBuilder.andWhere('activiteConf.lead_id = :lead_id', {
        lead_id: filter.lead_id,
      });
    }

    if (filter?.isFuturSoldier !== undefined) {
      queryBuilder.andWhere('activiteConf.isFuturSoldier = :isFuturSoldier', {
        isFuturSoldier: filter.isFuturSoldier,
      });
    }

    if (filter?.hasArrived !== undefined) {
      queryBuilder.andWhere('activiteConf.hasArrived = :hasArrived', {
        hasArrived: filter.hasArrived,
      });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: number): Promise<ActiviteConf> {
    const activiteConf = await this.activiteConfRepository.findOne({
      where: { id },
    });

    if (!activiteConf) {
      throw new NotFoundException(`ActiviteConf with ID ${id} not found`);
    }

    return activiteConf;
  }

  async findByLeadId(leadId: number): Promise<ActiviteConf[]> {
    return this.activiteConfRepository.find({
      where: { lead_id: leadId },
      order: { id: 'DESC' },
    });
  }

  async findByActiviteType(activiteType: number): Promise<ActiviteConf[]> {
    return this.activiteConfRepository.find({
      where: { activiteType },
      order: { id: 'DESC' },
    });
  }

  async update(
    id: number,
    updateActiviteConfDto: UpdateActiviteConfDto,
  ): Promise<ActiviteConf> {
    const activiteConf = await this.findOne(id);

    Object.assign(activiteConf, updateActiviteConfDto);

    return this.activiteConfRepository.save(activiteConf);
  }

  async remove(id: number): Promise<void> {
    const activiteConf = await this.findOne(id);
    await this.activiteConfRepository.remove(activiteConf);
  }

  async getStatistics(): Promise<{
    total: number;
    futurSoldiers: number;
    hasArrived: number;
    byActiviteType: { activiteType: number; count: number }[];
  }> {
    const [total, futurSoldiers, hasArrived] = await Promise.all([
      this.activiteConfRepository.count(),
      this.activiteConfRepository.count({ where: { isFuturSoldier: true } }),
      this.activiteConfRepository.count({ where: { hasArrived: true } }),
    ]);

    const byActiviteType = await this.activiteConfRepository
      .createQueryBuilder('activiteConf')
      .select('activiteConf.activiteType', 'activiteType')
      .addSelect('COUNT(*)', 'count')
      .groupBy('activiteConf.activiteType')
      .getRawMany();

    return {
      total,
      futurSoldiers,
      hasArrived,
      byActiviteType: byActiviteType.map((item) => ({
        activiteType: parseInt(item.activiteType),
        count: parseInt(item.count),
      })),
    };
  }

  async testConfirmationEmail(id: number): Promise<{
    message: string;
    participantEmail: string;
    activityName: string;
  }> {
    const activiteConf = await this.findOne(id);

    try {
      // Récupérer les détails de l'activité
      const activity = await this.activityService.findOne(
        activiteConf.activiteType,
      );

      if (!activity) {
        throw new NotFoundException(
          `Activity with ID ${activiteConf.activiteType} not found`,
        );
      }

      const participantName = `${activiteConf.firstName} ${activiteConf.lastName}`;

      // Envoyer l'email de test
      await this.mailService.sendActivityConfirmationEmail(
        activiteConf.mail,
        participantName,
        activity.name,
        activity.date,
      );

      this.logger.log(
        `Test confirmation email sent successfully to ${activiteConf.mail} for activity: ${activity.name}`,
      );

      return {
        message: 'Email de confirmation envoyé avec succès',
        participantEmail: activiteConf.mail,
        activityName: activity.name,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send test confirmation email for participant ${activiteConf.firstName} ${activiteConf.lastName}`,
        error.stack,
      );
      throw error;
    }
  }
}
