import { EconomyController, ReputationController } from "@controllers";
import { MemberEntity, GuildEntity } from "@entity";


declare module "discord.js" {
  interface Guild {
    options: ciGuildOptions;
    economy: ciGuildOptionsEconomy
    init(data: GuildEntity): void;
  }
  interface GuildMember {
    economyController: EconomyController;
    reputationController: ReputationController;
    init(data: MemberEntity): void;
  }
}

export type GuildEmojis = {
  money: string
  reputation: string
  donate: string
  accept: string
  decline: string
}

export interface ciGuildOptions {
  logchannel: string
}

export interface ciGuildOptionsEconomy {
  emoji: string;
  msgPerCount: number;
  voicePerCount: number;
}
