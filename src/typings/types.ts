import { EconomyController, ReputationController } from '@controllers';
import { MemberEntity, GuildEntity } from '@entity';
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
  header: string;
  commandForm: string;
  examples?: string[];
  initExamples(message: Message): string[];
}

export interface ciGuildOptionsEconomy {
  emoji: string;
  msgPerCount: number;
  voicePerCount: number;
}
