import { CiCommand, CiListener } from '@akairo';
import { TransferReactionEntity } from '@entity';
import { CiEmbed } from '@structures';
import { MessageReaction } from 'discord.js';

import { Message } from 'discord.js';

export default class MessageReactionRemoveEmoji extends CiListener {
  constructor() {
    super('messageReactionRemoveEmoji', {
      emitter: 'client',
      event: 'messageReactionRemoveEmoji',
    });
  }

  async exec({ message, remove }: MessageReaction) {
    if (!message.channel || !message.guild) return;
    const reactTransfer = await TransferReactionEntity.findOne({
      messageId: message.id,
      guildId: message.guild.id,
    });
    if (reactTransfer) {
      await message.channel.send(new CiEmbed().info('Роль по реакции была удалена!', null));
      await reactTransfer.remove();
      remove();
    }
  }
}
