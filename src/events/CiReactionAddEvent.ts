import { CiCommand, CiListener } from '@akairo';
import { GuildEntity, MemberEntity } from '@entity';
import { messages } from '@resources';
import { CiEmbed } from '@structures';
import { mainGuildId } from '@typings';
import { User } from 'discord.js';
import { MessageReaction } from 'discord.js';

export default class ReactionAddEvent extends CiListener {
  constructor() {
    super('messageReactionAdd', {
      emitter: 'client',
      event: 'messageReactionAdd',
    });
  }

  async exec({ message, emoji, client }: MessageReaction, userReaction: User) {
    const memberReaction = message.guild.members.cache.find(
      (member) => member.id == userReaction.id
    );
    if (memberReaction.id == message.author.id) {
      return message.channel.send(
        new CiEmbed().error('Ошибка', null, `Вы не можете подарить теплоту себе!`)
      );
    }

    if (emoji.toString() === message.guild.reputation.emoji) {
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
        message.channel.send(
          new CiEmbed().error(
            'Ошибка',
            `В этот день мы уже делились теплотой с ${message.member.displayName}`,
            infoEmbed.randomText.text,
            infoEmbed.randomText.author
          )
        );
      }
    }
  }
}
