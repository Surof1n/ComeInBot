import { TransferEntity } from '@entity';
import { CiClient } from '@structures';
import { Guild } from 'discord.js';
import * as moment from 'moment';

export class CiRepTimeout {
  public activeTimeOutReputation: NodeJS.Timeout;
  constructor() {
    this.activeTimeOutReputation;
  }

  public _init(guild: Guild, client: CiClient) {
    this.activeTimeOutReputation = setInterval(async () => {
      const clientmember = guild.members.cache.find((member) => member.id == client.user.id);
      const monthTransfer = await TransferEntity.findOne({
        transferType: 'monthReputation',
        transferGuild: guild.id,
      });
      if (!monthTransfer) {
        const newMonthTransfer = new TransferEntity(
          clientmember,
          clientmember,
          guild,
          'monthReputation',
          0
        );
        newMonthTransfer.save();
        return;
      }
      if (moment().diff(moment(monthTransfer.transferDate), 'month', true) >= 1) {
        guild.members.cache.forEach((member) => {
          member.reputationController.mouthUpdate();
        });
        monthTransfer.transferDate = new Date();
        monthTransfer.save();
        return;
      }
    }, 3600000);
  }
}
