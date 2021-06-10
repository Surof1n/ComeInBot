import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';
import {
  CiGuildOptions,
  CiGuildEconomy,
  CiGuildReputation,
  CiGuildDonate,
  CiGuildReport,
} from '@typings';

@Entity()
export class GuildEntity extends BaseEntity {
  @Index()
  @PrimaryColumn('char', { length: 18 })
  id: string;

  @Column('simple-json')
  options: CiGuildOptions;

  @Column('simple-json')
  economy: CiGuildEconomy;

  @Column('simple-json')
  reputation: CiGuildReputation;

  @Column('simple-json')
  donate: CiGuildDonate;

  @Column('simple-json')
  report: CiGuildReport;
}
