import { Message, GuildMember } from 'discord.js';
import { CiEmbed } from '@structures';
import { messages } from '@resources';
import { randomInt } from 'crypto';
import { CiCommand } from '@akairo';
import { Guild } from 'discord.js';
import { Channel } from 'discord.js';
import { GuildEntity } from '@entity';
import { TextChannel } from 'discord.js';

export default class GuildOptionsCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['guildoptions', 'настройгильдию', 'настроитьгильдию'],
      category: 'settings',
      description: 'Поправь или добавь настройки гильдии',
      args: [
        {
          index: 0,
          id: 'typeSettings',
          type: 'string',
        },
        {
          index: 1,
          id: 'valueSettings',
          type: 'string',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild }: Message,
    { typeSettings, valueSettings }: { typeSettings: string; valueSettings: string }
  ): Promise<Message> {
    const newchannel = valueSettings ? guild.channels.cache.get(valueSettings) : null;
    switch (typeSettings) {
      case 'logchannel':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              '',
              `Значение параметра у гильдии: <#${guild.options.logchannel}>`
            )
          );
        if (newchannel?.type != 'text')
          return channel.send(
            new CiEmbed().error(
              `Параметр ${typeSettings} не обновлён!`,
              '',
              `Значение параметра у гильдии осталось тем же: <#${guild.options.logchannel}>`
            )
          );
        guild.options.logchannel = valueSettings;
        GuildEntity.update({ id: guild.id }, { options: guild.options });
        return channel.send(
          new CiEmbed().info(
            `Обновление параметра ${typeSettings}`,
            '',
            `Значение параметра у гильдии измененно: <#${guild.options.logchannel}>`
          )
        );
      case 'voicePerCount':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              '',
              `Значение параметра у гильдии: ${guild.economy.voicePerCount}`
            )
          );
        if (isNaN(+valueSettings))
          return channel.send(
            new CiEmbed().error(
              `Параметр ${typeSettings} не обновлён!`,
              '',
              `Значение параметра у гильдии осталось тем же: ${guild.economy.voicePerCount}`
            )
          );
        guild.economy.voicePerCount = +valueSettings;
        GuildEntity.update({ id: guild.id }, { economy: guild.economy });
        return channel.send(
          new CiEmbed().info(
            `Обновление параметра ${typeSettings}`,
            '',
            `Значение параметра у гильдии измененно: ${guild.economy.voicePerCount}`
          )
        );
      default:
        return channel.send(
          new CiEmbed().error(
            `Параметр ${typeSettings} не найден!`,
            '',
            `Значения параметров у гильдии не изменены.`
          )
        );
    }
  }
}
