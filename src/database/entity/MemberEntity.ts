import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class MemberEntity extends BaseEntity {
  @Index()
  @PrimaryColumn('char', { length: 18 })
  id: string;

  @Column('int', { default: 0 })
  moneyCount: number;

  @Column('int', { default: 0 })
  incrementMonthMoneyCount: number;

  @Column('int', { default: 0 })
  incrementMoneyCount: number;

  @Column('int', { default: 0 })
  reputationCount: number;

  @Column('int', { default: 0 })
  rankedReputationCount: number;

  @Column('int', { default: 0 })
  pentaCount: number;

  @Column('timestamp', { nullable: true })
  voiceStartDate: Date;

  @Column('int', { default: 0 })
  voiceMinutesState: number;

  @Column('int', { default: 0 })
  messageCount: number;

  @Column('text', { default: '' })
  aboutProfile: string;
}
