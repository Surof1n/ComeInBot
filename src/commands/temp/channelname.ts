import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { Message, VoiceChannel } from 'discord.js';

export default class NameTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['channelname', 'изменитьимя', 'cname'],
      category: 'tempChannels',
      description: 'Измените имя вашего канала.',
      args: [
        {
          index: 0,
          id: 'newNameChannel',
          type: 'string',
          name: 'имя',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { newNameChannel }: { newNameChannel: string }
  ): Promise<void> {
    const timeChannelEntity = await guild.tempChannels.getEntityWithOwner(member.id);
    if (newNameChannel === undefined || newNameChannel === null) {
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if (!timeChannelEntity) {
      channel.send(new CiEmbed().info('Вы не владете каким-либо каналом!'));
      return;
    }
    try {
      const editChannel = guild.channels.cache.get(timeChannelEntity.channelID) as VoiceChannel;
      editChannel.setName(newNameChannel);
      channel.send(new CiEmbed().success('Вы изменили имя вашего канала!'));
    } catch (error) {
      channel.send(new CiEmbed().error('Ошибка при изменении имени вашего канала!'));
    }
    return;
  }
}
