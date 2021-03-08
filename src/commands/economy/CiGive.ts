import { Message, GuildMember } from 'discord.js';
import { CiEmbed } from '@structures';
import { messages } from '@resources';
import { randomInt } from 'crypto';
import { CiCommand } from '@akairo';
import { Guild } from 'discord.js';

export default class giveCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['give', 'передать'],
      category: 'economy',
      description: 'Передать определённую валюту указанному пользователю',
      cidescription: {
        header: 'Помощь по команде: передать',
        commandForm: '.передать <кол. валюты> <смайлик валюты> <пользователь>',
        rules: '<кол. валюты> > 0',
        initExamples(guild: Guild) {
          return [
            `.передать 200 ${guild.economy.emoji} <@205085626880491520>`,
            `.передать 200 ${guild.economy.emoji} Nexus`,
            `.передать 200 ${guild.economy.emoji} 20508562688049152`,
            `.передать 200 ${guild.economy.emoji} 20508562688049152 <@205085626880491520>`,
          ];
        },
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
      receiver: GuildMember[] | GuildMember;
    }
  ): Promise<Message> {
    if (!receiver || !valueType || !count)
      return channel.send(new CiEmbed().errorCommand(this.prefix));

    count = Math.round(count);
    const positive = count > 0;
    count = positive ? count : -count;
    switch (valueType) {
      case guild.economy.emoji:
        if (Array.isArray(receiver)) {
          if (member.economyController.sparkCount < receiver.length * count)
            return channel.send(new CiEmbed().errorCommandValue(this.prefix));
          receiver.forEach((recMember) => {
            const action = `Передача ${count} ${valueType} от ${member.displayName}, к ${recMember.displayName}`;
            member.economyController.send(count, recMember, action);
          });

          const embAction = {
            header: `${member.displayName} передал ${receiver.length} пользователям, по ${count} ${valueType}!`,
            quoting: messages.pay_currency[randomInt(0, messages.pay_currency.length)],
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
            header: `Передача ${count} ${valueType} от ${member.displayName}, к ${receiver.displayName}`,
            quoting: messages.pay_currency[randomInt(0, messages.pay_currency.length)],
          };
          const boolAboutSend = await member.economyController.send(
            count,
            receiver,
            embAction.header
          );
          boolAboutSend
            ? await channel.send(
                new CiEmbed().info(
                  'Уведомление!',
                  embAction.header,
                  embAction.quoting.text,
                  embAction.quoting.author
                )
              )
            : await channel.send(new CiEmbed().errorCommandValue(this.prefix));
        }
        break;

      default:
        return channel.send(new CiEmbed().errorCommand(this.prefix));
        break;
    }
  }
}
