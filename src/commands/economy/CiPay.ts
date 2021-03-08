import { Message, GuildMember } from 'discord.js';
import { CiEmbed } from '@structures';
import { messages } from '@resources';
import { randomInt } from 'crypto';
import { CiCommand } from '@akairo';
import { Guild } from 'discord.js';

export default class SendCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['pay', 'начислить'],
      category: 'economy',
      description: 'Начислить определённую валюту указанному пользователю',
      cidescription: {
        header: 'Помощь по команде: начислить',
        commandForm: '.начислить <кол. валюты> <смайлик валюты> <пользователь>',
        rules: '<кол. валюты> > 0',
        initExamples: (guild: Guild) => [
          `.начислить 200 ${guild.economy.emoji} <@205085626880491520>`,
          `.начислить 200 ${guild.economy.emoji} Nexus`,
          `.начислить 200 ${guild.economy.emoji} 20508562688049152`,
          `.начислить 200 ${guild.economy.emoji} 20508562688049152 <@205085626880491520>`,
        ],
      },
      args: [
        {
          index: 0,
          id: 'count',
          type: 'number',
        },
        {
          index: 1,
          id: 'valueType',
          type: 'string',
        },
        {
          index: 2,
          id: 'receiver',
          match: 'content',
          type: 'CiMembers',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild }: Message,
    {
      count,
      valueType,
      receiver,
    }: {
      count: number;
      valueType: string;
      receiver: GuildMember | GuildMember[];
    }
  ): Promise<Message> {
    if (!receiver || !valueType || !count)
      return channel.send(new CiEmbed().errorCommand(this.prefix));
    count = Math.round(count);
    const positive = count > 0;
    count = Math.abs(count);
    switch (valueType) {
      case guild.economy.emoji:
        if (Array.isArray(receiver)) {
          if (
            receiver.filter((recMember) => {
              recMember.economyController.sparkCount - count < 0;
            }).length != receiver.length &&
            !positive
          )
            return channel.send(new CiEmbed().errorCommandValue(this.prefix));

          receiver.forEach((recMember) => {
            if (positive) {
              const action = `Начисление ${count} ${valueType} от ${member.displayName}, к ${recMember.displayName}`;
              recMember.economyController.add(count, action);
            } else {
              const action = `Списание ${count} ${valueType} от ${member.displayName}, у ${recMember.displayName}`;
              recMember.economyController.remove(count, action);
            }
          });

          const embAction = {
            header: positive
              ? `${member.displayName} передал ${receiver.length} пользователям, по ${count} ${valueType}!`
              : `${member.displayName} списал у ${receiver.length} пользователей, по ${count} ${valueType}!`,
            quoting: messages.pay_currency.randomitem(),
          };

          channel.send(
            new CiEmbed().info(
              'Уведомление!',
              embAction.header,
              embAction.quoting.text,
              embAction.quoting.author
            )
          );
        } else {
          const embAction = {
            header: positive
              ? `Начисление ${count} ${valueType} от ${member.displayName}, к ${receiver.displayName}`
              : `Списание ${count} ${valueType} от ${member.displayName}, у ${receiver.displayName}`,

            quoting: messages.pay_currency.randomitem(),
          };

          if (receiver) {
            await receiver.economyController.add(count, embAction.header);
            await channel.send(
              new CiEmbed().info(
                'Уведомление!',
                embAction.header,
                embAction.quoting.text,
                embAction.quoting.author
              )
            );
          } else {
            await receiver.economyController.remove(count, embAction.header);
            await channel.send(new CiEmbed().errorCommandValue(this.prefix));
          }
        }
        break;

      default:
        return channel.send(new CiEmbed().errorCommand(this.prefix));
        break;
    }
  }
}
