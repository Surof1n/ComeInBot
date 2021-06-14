import { CiCommand } from '@akairo';
import { TempChannelsEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Message } from 'discord.js';
import { GuildMember } from 'discord.js';

export default class KickTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['kick', 'исключить', 'отключитьотканала', 'ckick'],
      category: 'tempChannels',
      description: 'Выгнать пользователя из комнаты с ограничением входа',
      args: [
        {
          index: 0,
          id: 'kickMember',
          type: 'member',
          name: 'пользователь',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { kickMember }: { kickMember: GuildMember }
  ): Promise<void> {
    if (!kickMember) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }

    if (author.id === kickMember.id) {
      channel.send(new CiEmbed().info('Использование команды на себе ограниченно!'));
      return;
    }
    let kickChannelEntity: TempChannelsEntity = null;
    if (kickMember.voice?.channel) {
      kickChannelEntity = await guild.tempChannels.getEntityWithAdmins(
        member.id,
        kickMember.voice.channel.id
      );
    } else {
      channel.send(
        new CiEmbed().info(
          'Вы и пользователь выставленный для исключения из канала, не подключенны к ним.',
          null,
          null,
          'В случае нарушений или проблем обратитесь за помощью к администрации.'
        )
      );
      return;
    }

    if (!kickChannelEntity) {
      channel.send(
        new CiEmbed().info(
          'Вы должны быть владельцем или совладелецем канала для использования данной команды.',
          null,
          null,
          'В случае нарушений или проблем обратитесь за помощью к администрации.'
        )
      );
      return;
    }

    if (kickChannelEntity.ownerID === kickMember.id) {
      channel.send(new CiEmbed().info('Использование команды на создателе комнаты ограниченно!'));
      return;
    }

    const kickChannel = guild.channels.cache.get(kickChannelEntity.channelID);
    if (kickChannel.members.get(kickMember.id)) {
      if (kickChannelEntity.coOwnersID.includes(kickMember.id)) {
        guild.tempChannels.removeCoOwner(kickMember.id, kickChannel.id);
      }
      kickMember.voice.kick();
      kickChannel.overwritePermissions([
        {
          id: kickMember.id,
          deny: 'CONNECT',
        },
      ]);
      channel.send(new CiEmbed().info('Пользователь был удалён из вашей комнаты!'));
    } else {
      channel.send(new CiEmbed().error('Пользователь не подключён к вашей комнате!'));
      return;
    }
  }
}
