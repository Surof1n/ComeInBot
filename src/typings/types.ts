import { EconomyController, ReputationController } from '@controllers';
import { MemberEntity, GuildEntity } from '@entity';
import { CiGuild } from '@structures';
import { Guild } from 'discord.js';
import { Message } from 'discord.js';

declare module 'discord.js' {
  interface Guild {
    options: CiGuildOptions;
    economy: CiGuildEconomy;
    init(data: GuildEntity): void;
  }
  interface GuildMember {
    economyController: EconomyController;
    reputationController: ReputationController;
    init(data: MemberEntity): void;
  }
}

declare module 'discord-akairo' {
  interface CommandOptions {
    cidescription?: CiDescription;
  }
}

declare global {
  interface Array<T> {
    randomitem(): T;
  }
}

export type GuildEmojis = {
  money: string;
  reputation: string;
  donate: string;
  accept: string;
  decline: string;
};

export interface CiGuildOptions {
  logchannel: string;
}

export interface CiDescription {
  header?: string;
  commandForm?: string;
  examples?: string[];
  rules?: string;
  initExamples(guild: Guild): string[];
}

export interface CiGuildEconomy {
  emoji: string;
  msgPerCount: number;
  voicePerCount: number;
}

export const mainGuildId = '703977369966346332';
