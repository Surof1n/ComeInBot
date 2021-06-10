import { CiCommand } from '@akairo';
import { TempChannelsEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Message } from 'discord.js';
import { GuildMember } from 'discord.js';
import { time } from 'node:console';

export default class DeleteTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['deletechannel', 'удалитьканал', 'удалениеканала', 'cdelete'],
      category: 'tempChannels',
      description: 'Удалите ваш приватный канал.',
    });
  }

  async exec({ member, channel, guild, author }: Message): Promise<void> {
    const timeChannelEntity = await guild.tempChannels.getEntityWithOwner(member.id);
    if (!timeChannelEntity) {
      channel.send(new CiEmbed().info('Вы не владете каким-либо каналом!'));
      return;
    }
    try {
      const deleteChannel = guild.channels.cache.get(timeChannelEntity.channelID);
      guild.tempChannels.remove(timeChannelEntity.channelID);
      deleteChannel.delete();
      channel.send(new CiEmbed().success('Ваш канал был удалён!'));
    } catch (error) {
      channel.send(new CiEmbed().error('Ошибка при удалении канала!'));
    }
    return;
  }
}
