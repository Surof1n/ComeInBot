import { CiCommand, CiListener } from '@akairo';
import { TransferReactionEntity } from '@entity';
import { CiEmbed } from '@structures';

import { Message } from 'discord.js';

export default class MessageReactionRemoveAll extends CiListener {
  constructor() {
    super('messageReactionRemoveAll', {
      emitter: 'client',
      event: 'messageReactionRemoveAll',
    });
  }

  async exec({ channel, id, guild }: Message) {
    if (!channel || !guild) return;
    const reactTransfer = await TransferReactionEntity.findOne({
      messageId: id,
      guildId: guild.id,
    });
    if (reactTransfer) {
      await channel.send(new CiEmbed().info('Роли по реакциям были удаленны!', null));
      await reactTransfer.remove();
    }
  }
}
