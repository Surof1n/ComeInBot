import { CiCommand } from '@akairo';
import { GuildEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Message } from 'discord.js';

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
          name: 'тип',
        },
        {
          index: 1,
          id: 'valueSettings',
          type: 'string',
          name: 'значение',
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
      'reportRoleID',
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
      case 'reportRoleID':
        if (!valueSettings)
          return channel.send(
            new CiEmbed().info(
              `Запрос на выдачу параметра ${typeSettings}`,
              null,
              `Значение параметра у гильдии: <@&${guild.report.options.reportRoleID}>`
            )
          );
        if (!newRole)
          return channel.send(
            new CiEmbed().error(
              `Параметр ${typeSettings} не обновлён!`,
              null,
              `Значение параметра у гильдии осталось тем же: <@&${guild.report.options.reportRoleID}>`
            )
          );
        guild.report.options.reportRoleID = valueSettings;
        GuildEntity.update({ id: guild.id }, { report: guild.report.options });
        return channel.send(
          new CiEmbed().info(
            `Обновление параметра ${typeSettings}`,
            null,
            `Значение параметра у гильдии измененно: ${newRole}`
          )
        );
      default:
        return channel.send(
          new CiEmbed().error(
            `Параметр не найден!`,
            null,
            `Значения параметров у гильдии не изменены.`
          )
        );
    }
  }
}
