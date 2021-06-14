import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { Message, VoiceChannel } from 'discord.js';

export default class LimitTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['channellimit', 'изменитьлимит', 'лимит', 'climit'],
      category: 'tempChannels',
      description: 'Измените лимит пользователей вашего канала.',
      args: [
        {
          index: 0,
          id: 'userLimitArgument',
          type: 'number',
          name: 'количество',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { userLimitArgument }: { userLimitArgument: number }
  ): Promise<void> {
    const timeChannelEntity = await guild.tempChannels.getEntityWithOwner(member.id);
    if (userLimitArgument === undefined || userLimitArgument === null) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if (!timeChannelEntity) {
      channel.send(new CiEmbed().info('Вы не владете каким-либо каналом!'));
      return;
    }
    try {
      const editChannel = guild.channels.cache.get(timeChannelEntity.channelID) as VoiceChannel;
      editChannel.setUserLimit(userLimitArgument);
      channel.send(new CiEmbed().success('Вы изменили лимит пользователей вашего канала!'));
    } catch (error) {
      channel.send(new CiEmbed().error('Ошибка при изменении лимита пользователей вашего канала!'));
    }
    return;
  }
}
