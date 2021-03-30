import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { Collection } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';
import { Message } from 'discord.js';
import { Categoryes, CategoryesIcon, Icons, TopsImages } from '../../config';

export default class HelpCommand extends CiCommand {
  constructor() {
    super({
      description: 'справочник по таблице рейтинга',
      category: 'utils',
      aliases: ['top', 'рейтинг'],
      args: [
        {
          index: 0,
          type: 'string',
          id: 'ranked',
          default: null,
        },
      ],
    });
  }
  async exec({ member, channel, guild, author }: Message, { ranked }: { ranked: string }) {
    if (ranked === 'теплота') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.reputationController.repValue > 0)
        .sort((a, b) => b.reputationController.repValue - a.reputationController.repValue)
        .array()
        .slice(0, 10)
        .map(
          (member) =>
            `${member.reputationController.repValue} ${guild.reputation.emoji} - ${member.displayName}`
        );
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ по теплоте',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else if (ranked === 'спарки') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.economyController.sparkCount > 0)
        .sort((a, b) => b.economyController.sparkCount - a.economyController.sparkCount)
        .array()
        .slice(0, 10)
        .map(
          (member) =>
            `${member.economyController.sparkCount} ${guild.economy.emoji} - ${member.displayName}`
        );
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ по спаркам',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else {
      const errorEmbed = new CiEmbed().errorCommandValue(this.prefix);
      channel.send(errorEmbed);
    }
  }
}
