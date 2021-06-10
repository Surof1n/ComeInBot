import type { Snowflake } from 'discord.js';
import { TimeOutSet, TimeOutTypes } from '../../config';
import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CheckIntervalEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('text')
  name: string;

  @Column('char', { length: 18 })
  guildId: Snowflake;

  @Column({ type: 'enum', enum: Array.from(TimeOutSet) })
  timeType: TimeOutTypes;

  @Column({ type: 'timestamp' })
  expireDate: Date;

  @Column('bool')
  status: boolean;
}
