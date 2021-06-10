import { CiClient } from '.';
import { GuildMember, Guild } from 'discord.js';
import {
  EconomyController,
  PentaController,
  ReputationController,
  TimeController,
} from '@controllers';
import { MemberEntity } from '@entity';

export class CiGuildMember extends GuildMember {
  economyController: EconomyController;
  reputationController: ReputationController;
  pentaController: PentaController;
  timeController: TimeController;
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor(client: CiClient, data: object, guild: Guild) {
    super(client, data, guild);

    this.timeController;
    this.economyController;
    this.reputationController;
    this.pentaController;
  }

  public async init(dataMember?: MemberEntity): Promise<void> {
    if (!dataMember) {
      dataMember = new MemberEntity();
      dataMember.id = this.id;
      await dataMember.save();
    }
    this.timeController = new TimeController(
      this,
      dataMember.voiceStartDate,
      dataMember.voiceMinutesState
    );
    this.economyController = new EconomyController(
      this,
      dataMember.moneyCount,
      dataMember.incrementMonthMoneyCount,
      dataMember.incrementMoneyCount,
      dataMember.messageCount
    );
    this.pentaController = new PentaController(this, dataMember.pentaCount);
    this.reputationController = new ReputationController(
      this,
      dataMember.reputationCount,
      dataMember.rankedReputationCount
    );
    return;
  }
}
