import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { GuildMember, Message } from 'discord.js';

export default class addCoOwnerTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['co-owner', 'со-овнер', 'праванаканал', 'cpermissions'],
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
    if (await guild.tempChannels.hasCoOwnerInChannels(adminMember.id)) {
      channel.send(new CiEmbed().info(`Данный пользователь уже имеет дополнительное руководство!`));
      return;
    }
    if (await guild.tempChannels.addCoOwner(adminMember.id, timeChannelEntity.id)) {
      channel.send(
        new CiEmbed().success(
          `Был добавлен новый со-руководитель комнаты!`,
          null,
          `Новый соруководитель комнаты: <@${adminMember.id}>`
        )
      );
      return;
    } else {
      channel.send(new CiEmbed().info(`Произошла ошибка при добавление со-руководителя комнаты!`));
      return;
    }
  }
}
