import { CiClient } from '.';
import { GuildMember, Guild } from 'discord.js';
import { EconomyController, ReputationController } from '@controllers';
import { MemberEntity } from '@entity';

export class CiGuildMember extends GuildMember {
  economyController: EconomyController;
  reputationController: ReputationController;

  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(client: CiClient, data: object, guild: Guild) {
    super(client, data, guild);

    this.economyController;
    this.reputationController;
  }

  public async init(dataMember?: MemberEntity): Promise<void> {
    if (!dataMember) {
      dataMember = new MemberEntity();
      dataMember.id = this.id;
      await dataMember.save();
    }

    this.economyController = new EconomyController(this, dataMember.moneyCount);
    this.reputationController = new ReputationController(
      this,
      dataMember.reputationCount
    );
    return;
  }
}
