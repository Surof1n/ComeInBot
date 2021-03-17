import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class MemberEntity extends BaseEntity {
  @Index()
  @PrimaryColumn('char', { length: 18 })
  id: string;

  @Column('int', { default: 0 })
  moneyCount: number;

  @Column('int', { default: 0 })
  reputationCount: number;

  @Column('int', { default: 0 })
  rankedReputationCount: number;
}
