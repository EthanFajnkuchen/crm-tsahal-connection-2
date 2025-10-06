import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activite_massa')
export class ActiviteMassa {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  id_activite_type: number;

  @Column({ length: 255 })
  programName: string;

  @Column({ length: 255 })
  programYear: string;

  @Column({ type: 'date' })
  date: Date;
}
