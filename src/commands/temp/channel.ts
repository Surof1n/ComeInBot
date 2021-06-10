import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { Message, VoiceChannel } from 'discord.js';

export default class LimitTempChannelCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['channelstate', 'состояниеканала', 'канал', 'cstate'],
      category: 'tempChannels',
      description: 'Закройте или откройте ваш канал от всех пользователей',
      args: [
        {
          index: 0,
          id: 'state',
          type: 'string',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild, author }: Message,
    { state }: { state: string }
  ): Promise<void> {
    const timeChannelEntity = await guild.tempChannels.getEntityWithOwner(member.id);
    if (!timeChannelEntity) {
      channel.send(new CiEmbed().info('Вы не владете каким-либо каналом!'));
      return;
    }
    switch (state) {
      case 'lock':
        const lockChannel = guild.channels.cache.get(timeChannelEntity.channelID) as VoiceChannel;
        lockChannel.overwritePermissions([
          {
            id: guild.roles.everyone.id,
            allow: 'CONNECT',
          },
        ]);
      case 'unlock':
        const unlockChannel = guild.channels.cache.get(timeChannelEntity.channelID) as VoiceChannel;
        unlockChannel.overwritePermissions([
          {
            id: guild.roles.everyone.id,
            deny: 'CONNECT',
          },
        ]);
        break;

      default:
        break;
    }
    return;
  }
}
