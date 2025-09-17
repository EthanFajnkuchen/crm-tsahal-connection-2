import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true })
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ length: 50 })
  category: string;
}
