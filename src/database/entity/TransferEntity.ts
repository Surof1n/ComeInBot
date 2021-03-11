import { Guild } from 'discord.js';
import { GuildMember } from 'discord.js';
import { TransferTypes } from 'src/config';
import { BaseEntity, Column, CreateDateColumn, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity()
export class TransferEntity extends BaseEntity {
  constructor(
    transferMember: GuildMember,
    transferReciver: GuildMember,
    transferGuild: Guild,
    transferType: TransferTypes,
    transferCount: number
  ) {
    super();
    this.transferId = new Date().getTime() + transferMember?.id;
    this.transferMemberId = transferMember?.id;
    this.transferReciverId = transferReciver?.id;
    this.transferGuild = transferGuild?.id;
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
