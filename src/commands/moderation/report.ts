import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { GuildMember, Message } from 'discord.js';

export default class ReportManagers extends CiCommand {
  constructor() {
    super({
      aliases: ['report', 'репорт'],
      category: 'moderation',
      description: 'Выдай репорт',
      args: [
        {
          index: 0,
          id: 'reportForMember',
          type: 'member',
          name: 'пользователь',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { reportForMember }: { reportForMember: GuildMember }
  ): Promise<void> {
    if (!reportForMember) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if (reportForMember.id === member.id) {
      channel.send(new CiEmbed().error('Не используйте команду на себе!'));
      return;
    }
    try {
      if (guild.report.addReport(reportForMember)) {
        const reportedRole = guild.roles.cache.get(guild.report.options.reportRoleID);
        if (reportedRole) {
          await reportForMember.roles.add(reportedRole);
          // ADD LOG TO SECOND SERVER
          if (member.voice?.channel) {
            await member.voice.kick();
          } else {
            return;
          }
        }
      } else {
        channel.send(new CiEmbed().error('Произошла ошибка при выдаче репорта!'));
        return;
      }
    } catch (error) {}
    return;
  }
}
