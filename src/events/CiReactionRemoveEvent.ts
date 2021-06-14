import { CiCommand, CiListener } from '@akairo';
import { GuildEntity, MemberEntity, TransferReactionEntity } from '@entity';
import { messages } from '@resources';
import { CiEmbed } from '@structures';
import { mainGuildId } from '@typings';
import { User } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { REASONS } from '../config';

export default class ReactionRemoveEvent extends CiListener {
  constructor() {
    super('messageReactionRemove', {
      emitter: 'client',
      event: 'messageReactionRemove',
    });
  }

  async exec({ message, emoji, client, count, remove }: MessageReaction, userReaction: User) {
    const memberReaction = message.guild.members.cache.find(
      (member) => member.id == userReaction.id
    );

    const matchEmoji = emoji.toString().emojimatcher();

    const emojiRoleTransfer = await TransferReactionEntity.findOne({
      messageId: message.id,
      react: matchEmoji,
      guildId: message.guild.id,
    });

    if (memberReaction.user.bot) {
      if (emojiRoleTransfer) {
        await message.channel.send(new CiEmbed().info('Роль по реакции была удалена!', null));
        await emojiRoleTransfer.remove();
        await remove();
      }
    }
    if (userReaction.bot) return;

    if (emojiRoleTransfer) {
      const reactRoleEmbed = new CiEmbed().success(
        'Снятие роли!',
        null,
        'Вы повторно нажали на реакцию, роль удалена!'
      );
      memberReaction.roles.remove(emojiRoleTransfer.roleId);
      message.channel.send(reactRoleEmbed);
    }
  }
}
