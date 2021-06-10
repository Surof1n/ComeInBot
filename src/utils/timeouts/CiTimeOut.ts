import { CheckIntervalEntity, TransferEntity } from '@entity';
import { CiClient } from '@structures';
import { Guild } from 'discord.js';
import * as moment from 'moment';
import { TimeOutSet, TimeOutTypes } from '../../config';
export class CiTimeout {
  public activeTimeOut: NodeJS.Timeout;
  constructor() {
    this.activeTimeOut;
  }

  public _init(client: CiClient, guild: Guild) {
    this.activeTimeOut = setInterval(async () => {
      const clientmember = guild.members.cache.find((member) => member.id == client.user.id);
      const timeOutEntity = await CheckIntervalEntity.find();
      if (timeOutEntity.length != Array.from(TimeOutSet).length) {
        for await (const type of TimeOutSet.keys()) {
          const newEntityTimeOut = new CheckIntervalEntity();
          newEntityTimeOut.name = 'timeOut' + type;
          newEntityTimeOut.guildId = guild.id;
          newEntityTimeOut.timeType = type as TimeOutTypes;
          newEntityTimeOut.expireDate = moment()
            .add('1', type as moment.DurationInputArg2)
            .startOf(type as moment.unitOfTime.StartOf)
            .toDate();
          newEntityTimeOut.status = true;
          newEntityTimeOut.save();
        }
      }

      if (timeOutEntity) {
        for await (const entity of timeOutEntity) {
          if (entity.status) {
            if (moment().isAfter(moment(entity.expireDate))) {
              switch (entity.timeType) {
                case 'month':
                  guild.members.cache.forEach((member) => {
                    member.reputationController.mouthUpdate();
                    member.economyController.resetMonthSparkCount();
                  });
                  break;
                default:
                  break;
              }
              entity.expireDate = moment()
                .add('1', entity.timeType as moment.DurationInputArg2)
                .startOf(entity.timeType as moment.unitOfTime.StartOf)
                .toDate();
              entity.save();
            }
          }
        }
      }
    }, 5000);
  }
}
