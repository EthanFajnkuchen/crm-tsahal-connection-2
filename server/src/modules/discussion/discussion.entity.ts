import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Lead } from '../lead/lead.entity';

@Entity('discussions')
export class Discussion {
  @PrimaryGeneratedColumn()
  ID: number;

  @Column()
  id_lead: number;

  @Column({ type: 'date' })
  date_discussion: Date;

  @Column('text')
  contenu: string;

  @ManyToOne(() => Lead)
  @JoinColumn({ name: 'id_lead' })
  lead: Lead;

  @Column('text')
  created_by: string;
}
