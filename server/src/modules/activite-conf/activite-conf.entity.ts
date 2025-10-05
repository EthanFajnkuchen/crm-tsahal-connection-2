import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('activite_conf')
export class ActiviteConf {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'bigint', unsigned: true })
  activiteType: number;

  @Column({ length: 255 })
  firstName: string;

  @Column({ length: 255 })
  lastName: string;

  @Column({ type: 'tinyint', width: 1, default: false })
  isFuturSoldier: boolean;

  @Column({ length: 20 })
  phoneNumber: string;

  @Column({ length: 255 })
  mail: string;

  @Column({ type: 'int' })
  lead_id: number;

  @Column({ type: 'tinyint', width: 1, default: false })
  hasArrived: boolean;
}
