import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ActiviteMassa } from '../activite-massa/activite-massa.entity';
import { Lead } from '../lead/lead.entity';

@Entity('activite_massa_participation')
export class ActiviteMassaParticipation {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  id_activite_massa: number;

  @Column({ type: 'int' })
  lead_id: number;

  @ManyToOne(() => ActiviteMassa)
  @JoinColumn({ name: 'id_activite_massa' })
  activiteMassa: ActiviteMassa;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'lead_id' })
  lead: Lead;
}
