import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChangeRequest } from './change-request.entity';
import { Lead } from '../lead/lead.entity';
import {
  CreateChangeRequestDto,
  UpdateChangeRequestDto,
} from './change-request.dto';
import { ChangeRequestNotificationService } from './change-request-notification.service';

@Injectable()
export class ChangeRequestService {
  constructor(
    @InjectRepository(ChangeRequest)
    private readonly changeRequestRepository: Repository<ChangeRequest>,
    @Inject(forwardRef(() => ChangeRequestNotificationService))
    private readonly notificationService: ChangeRequestNotificationService,
  ) {}

  async create(
    createChangeRequestDto: CreateChangeRequestDto,
  ): Promise<ChangeRequest> {
    const changeRequest = this.changeRequestRepository.create(
      createChangeRequestDto,
    );
    const savedRequest = await this.changeRequestRepository.save(changeRequest);

    // Programmer la notification avec debounce
    await this.notificationService.scheduleNotification(
      savedRequest.leadId,
    );

    return savedRequest;
  }

  async findAll(): Promise<ChangeRequest[]> {
    return this.changeRequestRepository.find({
      relations: ['lead'],
      order: { id: 'DESC' },
    });
  }

  /**
   * Récupère les demandes groupées par contact
   * Utile pour l'affichage dans la vue admin
   */
  async findAllGroupedByLead(): Promise<
    Array<{
      leadId: number;
      lead: Lead;
      requests: ChangeRequest[];
      totalCount: number;
      volunteers: string[];
    }>
  > {
    const allRequests = await this.changeRequestRepository.find({
      relations: ['lead'],
      order: { dateModified: 'DESC' },
    });

    // Grouper par leadId
    const grouped = new Map<
      number,
      { lead: Lead; requests: ChangeRequest[]; volunteers: Set<string> }
    >();

    for (const request of allRequests) {
      if (!grouped.has(request.leadId)) {
        grouped.set(request.leadId, {
          lead: request.lead,
          requests: [],
          volunteers: new Set(),
        });
      }

      const group = grouped.get(request.leadId);
      group.requests.push(request);
      group.volunteers.add(request.changedBy);
    }

    // Convertir en array avec formatage
    return Array.from(grouped.entries()).map(([leadId, group]) => ({
      leadId,
      lead: group.lead,
      requests: group.requests,
      totalCount: group.requests.length,
      volunteers: Array.from(group.volunteers),
    }));
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
    const leadId = changeRequest.leadId;

    // Supprimer la demande
    await this.changeRequestRepository.remove(changeRequest);

    // Vérifier s'il reste d'autres demandes en attente pour ce lead
    const remainingRequests = await this.changeRequestRepository.count({
      where: {
        leadId,
        emailNotified: false,
      },
    });

    // Si c'est la dernière demande en attente, annuler le timer de notification
    if (remainingRequests === 0) {
      this.notificationService.cancelNotification(leadId);
    }
  }
}
