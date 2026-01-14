import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Lead } from '../lead/lead.entity';

@Entity('change_requests')
export class ChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  leadId: number;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'leadId' })
  lead: Lead;

  @Column({ length: 255 })
  fieldChanged: string;

  @Column('text')
  oldValue: string;

  @Column('text')
  newValue: string;

  @Column({ length: 255 })
  changedBy: string;

  @Column({ type: 'datetime' })
  dateModified: Date;

  @Column({ default: false })
  emailNotified: boolean;

  @Column({ type: 'datetime', nullable: true })
  emailNotifiedAt: Date;

  @Column({ type: 'datetime', nullable: true })
  notificationScheduledAt: Date;
}
