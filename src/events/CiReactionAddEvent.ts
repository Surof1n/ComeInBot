import { CiCommand, CiListener } from '@akairo';
import { GuildEntity, MemberEntity, TransferReactionEntity } from '@entity';
import { messages } from '@resources';
import { CiEmbed } from '@structures';
import { mainGuildId } from '@typings';
import { User } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { REASONS } from '../config';

export default class ReactionAddEvent extends CiListener {
  constructor() {
    super('messageReactionAdd', {
      emitter: 'client',
      event: 'messageReactionAdd',
    });
  }

  async exec(reaction: MessageReaction, userReaction: User) {
    const { message, emoji, client } = reaction;
    const memberReaction = message.guild.members.cache.find(
      (member) => member.id == userReaction.id
    );

    if (userReaction.bot) return;

    const matchEmoji = emoji.toString().emojimatcher();

    const emojiRoleTransfer = await TransferReactionEntity.findOne({
      messageId: message.id,
      react: matchEmoji,
      guildId: message.guild.id,
    });
    if (memberReaction.roles.cache.get(emojiRoleTransfer?.roleId)) return;
    if (emojiRoleTransfer) {
      const economyEmoji = message.guild.economy.emoji.emojimatcher();
      const pentaEmoji = message.guild.donate.emoji.emojimatcher();
      const reactRoleEmbed = new CiEmbed().success(
        'Выдача роли!',
        null,
        'Вы нажали на реакцию, роль успешна выдана!'
      );
      if (economyEmoji === emojiRoleTransfer.type) {
        const successbuy = await memberReaction.economyController.remove(
          emojiRoleTransfer.cost,
          REASONS.BUY_ROLE
        );
        if (!successbuy) {
          message.channel.send(new CiEmbed().errorRoleReactEconomyValue());
          return;
        }
        reactRoleEmbed.addField(
          'Вы потратили:',
          `${emojiRoleTransfer.cost} ${message.guild.economy.emoji}`
        );
      } else if (pentaEmoji === emojiRoleTransfer.type) {
        const successbuy = await memberReaction.pentaController.remove(
          emojiRoleTransfer.cost,
          REASONS.BUY_ROLE
        );
        if (!successbuy) {
          message.channel.send(new CiEmbed().errorRoleReactEconomyValue());
          return;
        }
        reactRoleEmbed.addField(
          'Вы потратили:',
          `${emojiRoleTransfer.cost} ${message.guild.donate.emoji}`
        );
      }
      memberReaction.roles.add(emojiRoleTransfer.roleId);
      message.channel.send(reactRoleEmbed);
    }
    if (
      memberReaction.id === message.author.id &&
      emoji.toString().emojimatcher() === message.guild.reputation.emoji.toString().emojimatcher()
    ) {
      const finallyMessage = await message.channel.send(
        new CiEmbed().error('Ошибка!', null, `Вы не можете подарить теплоту себе!`)
      );
      await finallyMessage.delete({ timeout: 5000 });
      await reaction.remove();
      return;
    }

    if (emoji.toString() === message.guild.reputation.emoji && !message.author.bot) {
      const infoEmbed = {
        title: `${memberReaction.displayName} дарит теплоту ${message.member.displayName}`,
        randomText: messages.rep_given.randomitem(),
      };
      if (await memberReaction.reputationController.send(message.member, infoEmbed.title)) {
        message.channel.send(
          new CiEmbed().info(
            'Уведомление!',
            infoEmbed.title,
            infoEmbed.randomText.text,
            infoEmbed.randomText.author
          )
        );
      } else {
        const finallyMessage = await message.channel.send(
          new CiEmbed().info(
            'Ошибка',
            `В этот день мы уже делились теплотой с ${message.member.displayName}`,
            infoEmbed.randomText.text,
            infoEmbed.randomText.author
          )
        );
        await finallyMessage.delete({ timeout: 4000 });
        await reaction.remove();
      }
    }
  }
}
