import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('change_requests')
export class ChangeRequest {
  @PrimaryGeneratedColumn()
  id: number;

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
}
