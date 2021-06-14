import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { GuildMember, Message } from 'discord.js';

export default class ReportManagers extends CiCommand {
  constructor() {
    super({
      aliases: ['r-managers', 'репортменеджер', 'рменеджер'],
      category: 'moderation',
      description: 'Выдай права на выдачу репортов',
      args: [
        {
          index: 0,
          id: 'action',
          type: 'text',
          name: 'действие',
        },
        {
          index: 1,
          id: 'reportManager',
          type: 'member',
          name: 'пользователь',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { action, reportManager }: { action: string; reportManager: GuildMember }
  ): Promise<void> {
    if (!reportManager || !action) {
      console.log(reportManager, action);
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if (action === 'add') {
      if (guild.report.hasManager(reportManager)) {
        channel.send(
          new CiEmbed().info(
            'Новый репорт менеджер не добавлен',
            null,
            `Данный пользователь ${reportManager}, уже является им.`
          )
        );
        return;
      }
      guild.report.addManager(reportManager);
      channel.send(
        new CiEmbed().success(
          'Новый репорт менеджер был добавлен!',
          null,
          `Новый репорт менеджер: ${reportManager}`
        )
      );
      return;
    } else if (action === 'remove') {
      if (!guild.report.hasManager(reportManager)) {
        channel.send(
          new CiEmbed().info(
            'Репорт менеджен не удалён',
            null,
            `Данный пользователь ${reportManager}, не является репорт менеджером.`
          )
        );
        return;
      }
      guild.report.removeManager(reportManager);
      channel.send(
        new CiEmbed().success(
          'Репорт менеджер был удалён!',
          null,
          `Удалённый репорт менеджер: ${reportManager}`
        )
      );
      return;
    } else {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    return;
  }
}
