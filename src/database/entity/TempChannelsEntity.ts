import { Snowflake } from 'discord.js';
import { BaseEntity, Entity, Index, PrimaryColumn, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TempChannelsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn('char', { length: 18 })
  channelID: Snowflake;

  @Column('char', { length: 18 })
  ownerID: Snowflake;

  @Column('char', { array: true, length: 18, nullable: true })
  coOwnersID: Snowflake[] | null;
}
