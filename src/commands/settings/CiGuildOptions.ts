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
    const newChannel = valueSettings ? guild.channels.cache.get(valueSettings) : null;
    const newRole = valueSettings ? guild.roles.cache.get(valueSettings) : null;
    const listOptions = [
      'logchannel',
      'createVoiceChannel',
      'voicePerCount',
      'msgPerCount',
      'startRole',
    ];
    switch (typeSettings) {
      case 'list':
        return channel.send(
          new CiEmbed().info(
            `Запрос на выдачу параметров`,
            '',
            `${listOptions.map((item) => `\`\`${item}\`\``).join(', ')}`
          )
        );
      case 'logchannel':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              '',
              `Значение параметра у гильдии: <#${guild.options.logchannel}>`
            )
          );
        if (newChannel?.type != 'text')
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
            `Значение параметра у гильдии измененно: ${newChannel}>`
          )
        );
      case 'createVoiceChannel':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              '',
              `Значение параметра у гильдии: <#${guild.options.createVoiceChannel}>`
            )
          );
        if (newChannel?.type != 'voice')
          return channel.send(
            new CiEmbed().error(
              `Параметр ${typeSettings} не обновлён!`,
              '',
              `Значение параметра у гильдии осталось тем же: <#${guild.options.createVoiceChannel}>`
            )
          );
        guild.options.createVoiceChannel = valueSettings;
        GuildEntity.update({ id: guild.id }, { options: guild.options });
        return channel.send(
          new CiEmbed().info(
            `Обновление параметра ${typeSettings}`,
            '',
            `Значение параметра у гильдии измененно: ${newChannel}`
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
      case 'msgPerCount':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              '',
              `Значение параметра у гильдии: ${guild.economy.msgPerCount}`
            )
          );
        if (isNaN(+valueSettings))
          return channel.send(
            new CiEmbed().error(
              `Параметр ${typeSettings} не обновлён!`,
              '',
              `Значение параметра у гильдии осталось тем же: ${guild.economy.msgPerCount}`
            )
          );
        guild.economy.msgPerCount = +valueSettings;
        GuildEntity.update({ id: guild.id }, { economy: guild.economy });
        return channel.send(
          new CiEmbed().info(
            `Обновление параметра ${typeSettings}`,
            '',
            `Значение параметра у гильдии измененно: ${guild.economy.msgPerCount}`
          )
        );
      case 'startRole':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              '',
              `Значение параметра у гильдии: <@&${guild.options.startRole}>`
            )
          );
        if (!newRole)
          return channel.send(
            new CiEmbed().error(
              `Параметр ${typeSettings} не обновлён!`,
              '',
              `Значение параметра у гильдии осталось тем же: <@&${guild.options.startRole}>`
            )
          );
        guild.options.startRole = valueSettings;
        GuildEntity.update({ id: guild.id }, { options: guild.options });
        return channel.send(
          new CiEmbed().info(
            `Обновление параметра ${typeSettings}`,
            '',
            `Значение параметра у гильдии измененно: ${newRole}`
          )
        );
      default:
        return channel.send(
          new CiEmbed().error(
            `Параметр не найден!`,
            '',
            `Значения параметров у гильдии не изменены.`
          )
        );
    }
  }
}
