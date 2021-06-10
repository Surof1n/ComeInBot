import { CiCommand, CiListener } from '@akairo';
import { TransferReactionEntity } from '@entity';
import { CiEmbed } from '@structures';

import { Message } from 'discord.js';

export default class MessageDelete extends CiListener {
  constructor() {
    super('messageDelete', {
      emitter: 'client',
      event: 'messageDelete',
    });
  }

  async exec({ channel, id, guild }: Message) {
    if (!channel || !guild) return;
    const reactTransfer = await TransferReactionEntity.findOne({
      messageId: id,
      guildId: guild.id,
    });
    if (reactTransfer) {
      await channel.send(
        new CiEmbed().info('Роли по реакциям c удалённого сообщения были удаленны!', null)
      );
      await reactTransfer.remove();
    }
  }
}
