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
      aliases: ['top', 'рейтинг', 'топ'],
      args: [
        {
          index: 0,
          type: 'string',
          id: 'ranked',
          default: null,
          name: 'вид топа',
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
              'Топ пользователей по теплоте за месяц',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else if (ranked === 'теплота-завсёвремя') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.reputationController.allTimeRepValue > 0)
        .sort(
          (a, b) => b.reputationController.allTimeRepValue - a.reputationController.allTimeRepValue
        )
        .array()
        .slice(0, 10)
        .map(
          (member) =>
            `${member.reputationController.allTimeRepValue} ${guild.reputation.emoji} - ${member.displayName}`
        );
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ пользователей по теплоте за всё время',
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
              'Топ пользователей по количеству спарков',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else if (ranked === 'заработанныеспарки') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.economyController.sparkAllTimeCountTop > 0)
        .sort(
          (a, b) =>
            b.economyController.sparkAllTimeCountTop - a.economyController.sparkAllTimeCountTop
        )
        .array()
        .slice(0, 10)
        .map(
          (member) =>
            `${member.economyController.sparkAllTimeCountTop} ${guild.economy.emoji} - ${member.displayName}`
        );
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ пользователей по заработанным спаркам за всё время',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else if (ranked === 'заработанныеспарки-замесяц') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.economyController.sparkMonthCountTop > 0)
        .sort(
          (a, b) => b.economyController.sparkMonthCountTop - a.economyController.sparkMonthCountTop
        )
        .array()
        .slice(0, 10)
        .map(
          (member) =>
            `${member.economyController.sparkMonthCountTop} ${guild.economy.emoji} - ${member.displayName}`
        );
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ пользователей по заработанным спаркам за месяц',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else if (ranked === 'количество-сообщений') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.economyController.messagesCount > 0)
        .sort((a, b) => b.economyController.messagesCount - a.economyController.messagesCount)
        .array()
        .slice(0, 10)
        .map((member) => `${member.economyController.messagesCount} - ${member.displayName}`);
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ пользователей по количеству сообщений',
              null,
              `${rankedTopForEmbed.join(`\n\n`)}`,
              null,
              TopsImages
            )
          : new CiEmbed().error('Ошибка в поиске топа', null, `Топа не существует`);
      await channel.send(rankedEmbed);
    } else if (ranked === 'время-вканале') {
      const rankedTopForEmbed = guild.members.cache
        .filter((member) => member.timeController.minutesState > 0)
        .sort((a, b) => b.timeController.minutesState - a.timeController.minutesState)
        .array()
        .slice(0, 10)
        .map((member) => `${member.timeController.minutesState} - ${member.displayName}`);
      const rankedEmbed =
        rankedTopForEmbed.length > 0
          ? new CiEmbed().create(
              'Топ пользователей по времени в канале',
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
