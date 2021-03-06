import { CiCommand } from '@akairo';
import { messages } from '@resources';
import { CiEmbed } from '@structures';
import { Guild, GuildMember, Message } from 'discord.js';

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
          name: 'количество',
        },
        {
          index: 1,
          id: 'valueType',
          type: 'string',
          name: 'тип',
        },
        {
          index: 2,
          id: 'receiver',
          match: 'rest',
          type: 'CiMembers',
          name: 'пользователи',
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
  ): Promise<void> {
    if (!receiver || !valueType || !count) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }

    count = Math.round(count);
    const positive = count > 0;
    count = Math.abs(count);
    switch (valueType) {
      case guild.economy.emoji:
        if (Array.isArray(receiver)) {
          if (member.economyController.sparkCount < receiver.length * count) {
            channel.send(new CiEmbed().errorCommandEconomyValue(this.prefix));
            return;
          }

          receiver.forEach((recMember) => {
            const action = `Передача ${count} ${valueType} от ${member.displayName}, к ${recMember.displayName}`;
            member.economyController.send(count, recMember, action);
          });

          const embAction = {
            header: `${member.displayName} передал ${receiver.length} пользователям, по ${count} ${valueType}!`,
            quoting: messages.send_currency.randomitem(),
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
            quoting: messages.send_currency.randomitem(),
          };
          const boolAboutSend = await member.economyController.send(
            count,
            receiver,
            embAction.header
          );
          if (boolAboutSend) {
            channel.send(
              new CiEmbed().info(
                'Уведомление!',
                embAction.header,
                embAction.quoting.text,
                embAction.quoting.author
              )
            );
            return;
          } else {
            channel.send(new CiEmbed().errorCommandEconomyValue(this.prefix));
            return;
          }
        }
        break;

      default:
        channel.send(new CiEmbed().errorCommandValue(this.prefix));
        return;
    }
  }
}
