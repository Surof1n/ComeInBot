import { CiCommand } from '@akairo';
import { TempChannelsEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { time } from 'node:console';

export default class addCoOwnerTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['csendowner', 'owner', 'овнер', 'передачаовнера'],
      category: 'tempChannels',
      description: 'Передай создателя канала иному пользователю',
      args: [
        {
          index: 0,
          id: 'newOwnerMember',
          type: 'member',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { newOwnerMember }: { newOwnerMember: GuildMember }
  ): Promise<void> {
    if (!newOwnerMember) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if (author.id === newOwnerMember.id) {
      channel.send(new CiEmbed().info('Использование команды на себе ограниченно!'));
      return;
    }
    const timeChannelEntity = guild.tempChannels.getItemInCollectionWithOwner(member.id);
    if (!timeChannelEntity) {
      channel.send(
        new CiEmbed().info('Вы не можете изменить права, так как у вас нету созданного канала!')
      );
      return;
    }
    if (await guild.tempChannels.hasOnwerInChannels(newOwnerMember.id)) {
      channel.send(new CiEmbed().info(`Данный пользователь уже имеет свой канал!`));
      return;
    }
    if (await guild.tempChannels.switchOwner(member.id, newOwnerMember.id)) {
      channel.send(
        new CiEmbed().success(
          `Вы сменили создателя комнаты`,
          null,
          `Новый руководитель комнаты: <@${newOwnerMember.id}>`
        )
      );
      return;
    } else {
      channel.send(new CiEmbed().info(`Произошла ошибка при изменении создателя комнаты!`));
      return;
    }
  }
}
