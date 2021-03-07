import { EconomyController, ReputationController } from '@controllers';
import { MemberEntity, GuildEntity } from '@entity';
import { CiGuild } from '@structures';
import { Guild } from 'discord.js';
import { Message } from 'discord.js';

declare module 'discord.js' {
  interface Guild {
    options: ciGuildOptions;
    economy: ciGuildOptionsEconomy;
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

export type GuildEmojis = {
  money: string;
  reputation: string;
  donate: string;
  accept: string;
  decline: string;
};

export interface ciGuildOptions {
  logchannel: string;
}

export interface CiDescription {
  header?: string;
  commandForm?: string;
  examples?: string[];
  rules?: string;
  initExamples(guild: Guild): string[];
}

export interface ciGuildOptionsEconomy {
  emoji: string;
  msgPerCount: number;
  voicePerCount: number;
}

export const mainGuildId = '703977369966346332';
