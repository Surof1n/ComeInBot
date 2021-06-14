import { CiCommand } from '@akairo';
import { TempChannelsEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { time } from 'node:console';

export default class removeCoOwnerTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['dco-owner', 'дсо-овнер', 'убратьправанаканал', 'dcpermissions'],
      category: 'tempChannels',
      description: 'Выдай права на канал',
      args: [
        {
          index: 0,
          id: 'adminMember',
          type: 'member',
          name: 'пользователь',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { adminMember }: { adminMember: GuildMember }
  ): Promise<void> {
    if (!adminMember) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if (author.id === adminMember.id) {
      channel.send(new CiEmbed().info('Использование команды на себе ограниченно!'));
      return;
    }
    const timeChannelEntity = guild.tempChannels.getItemInCollectionWithOwner(member.id);
    if (!timeChannelEntity) {
      channel.send(
        new CiEmbed().info('Вы не можете выдать права, так как у вас нету созданного канала!')
      );
      return;
    }
    if (
      guild.tempChannels.removeCoOwner(adminMember.id, timeChannelEntity.id) &&
      guild.tempChannels.hasCoOwnerInChannels(adminMember.id)
    ) {
      channel.send(new CiEmbed().success(`Был удалён со-руководитель комнаты!`));
      return;
    } else {
      channel.send(new CiEmbed().info(`Произошла ошибка при удалении со-руководителя комнаты!`));
      return;
    }
  }
}
