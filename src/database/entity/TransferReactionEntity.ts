import { Message, Role } from 'discord.js';
import { BaseEntity, Column, Entity, Index, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TransferReactionEntity extends BaseEntity {
  constructor(message: Message, role: Role, react: string, cost: number, type: string) {
    super();
    this.messageId = message?.id;
    this.channelMessageId = message?.channel?.id;
    this.guildId = message?.guild?.id;
    this.roleId = role?.id;
    this.react = react;
    this.cost = cost;
    this.type = type;
  }
  @PrimaryGeneratedColumn()
  id: string;

  @Column('char', { length: 18 })
  messageId: string;

  @Column('char', { length: 18 })
  channelMessageId: string;

  @Column('char', { length: 18 })
  guildId: string;

  @Column('char', { length: 18 })
  roleId: string;

  @Column('text')
  react: string;

  @Column('int', { nullable: true })
  cost: number;

  @Column('text', { nullable: true })
  type: string;
}
