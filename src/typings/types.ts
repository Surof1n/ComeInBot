import {
  EconomyController,
  PentaController,
  ReputationController,
  TimeController,
} from '@controllers';
import { MemberEntity, GuildEntity } from '@entity';
import { CiGuild, CiGuildReportsManager, GuildTempChannelsManager } from '@structures';
import { Snowflake } from 'discord.js';
import { Guild } from 'discord.js';
import { Message } from 'discord.js';

declare module 'discord.js' {
  interface Guild {
    options: CiGuildOptions;
    economy: CiGuildEconomy;
    reputation: CiGuildReputation;
    donate: CiGuildDonate;
    tempChannels: GuildTempChannelsManager;
    report: CiGuildReportsManager;
    init(data: GuildEntity): void;
  }
  interface GuildMember {
    timeController: TimeController;
    economyController: EconomyController;
    reputationController: ReputationController;
    pentaController: PentaController;
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
  interface String {
    emojimatcher(): string;
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
  startRole: string;
  logchannel: string;
  createVoiceChannel: string;
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

export interface CiGuildReputation {
  emoji: string;
}

export interface CiGuildDonate {
  emoji: string;
}

export interface CiGuildReport {
  reportManagers: Snowflake[];
}

export const mainGuildId = '703977369966346332';
