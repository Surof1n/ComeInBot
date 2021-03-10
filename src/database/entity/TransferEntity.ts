import { TransferTypes } from 'src/config';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class TransferEntity extends BaseEntity {
  constructor(
    transferId: string,
    transferMemberId: string,
    transferGuild: string,
    transferReciverId: string,
    transferType: TransferTypes,
    transferCount: number
  ) {
    super();
    this.transferId = transferId;
    this.transferMemberId = transferMemberId;
    this.transferGuild = transferGuild;
    this.transferReciverId = transferReciverId;
    this.transferType = transferType;
    this.transferCount = transferCount;
  }
  @Index()
  @PrimaryColumn('text')
  transferId: string;

  @PrimaryColumn('char', { length: 18 })
  transferMemberId: string;

  @PrimaryColumn('char', { length: 18 })
  transferGuild: string;

  @Column('char', { length: 18 })
  transferReciverId: string;

  @Column({ type: 'enum', enum: ['spark', 'penta', 'reputation'] })
  transferType: TransferTypes;

  @Column('int')
  transferCount: number;

  @CreateDateColumn()
  transferDate: Date;
}
