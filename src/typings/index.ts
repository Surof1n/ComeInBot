import { EconomyController, ReputationController } from "@controllers";
import { MemberEntity, GuildEntity } from "@entity";


declare module "discord.js" {
  interface Guild {
    options: CiGuildOptions;
    init(data: GuildEntity): void;
  }
  interface GuildMember {
    economyController: EconomyController;
    reputationController: ReputationController;
    init(data: MemberEntity): void;
  }
}

export default interface CiGuildOptions {
  msgPerCount: number;
}
