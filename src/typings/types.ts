import {
  EconomyController,
  PentaController,
  ReputationController,
  TimeController,
} from '@controllers';
import { GuildEntity, MemberEntity } from '@entity';
import { CiGuildReportsManager, GuildTempChannelsManager } from '@structures';
import { Guild, Message, Snowflake } from 'discord.js';

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
    aboutValue: string;
    init(data: MemberEntity): void;
  }
}

declare module 'discord-akairo' {
  interface CommandOptions {
    cidescription?: CiDescription;
  }
  interface Command {
    cidescription?: CiDescription;
    argsInOptions?: ArgumentOptions[] | ArgumentGenerator;
  }
  interface ArgumentOptions {
    name: string;
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
  memberHasReport: Snowflake[];
  reportRoleID: Snowflake;
}

export const mainGuildId = '703977369966346332';
