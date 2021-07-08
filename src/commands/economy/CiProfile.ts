import { CiCommand } from '@akairo';
import { messages } from '@resources';
import { CiEmbed } from '@structures';
import { Guild, GuildMember, Message } from 'discord.js';
import { CiCardsProfile } from '../../utils/cards/CiCardsProfile';

export default class profileCommand extends CiCommand {
  constructor() {
    super({
      aliases: ['profile', 'профиль', 'карточка'],
      category: 'economy',
      description: 'Вызовите свою или чужую карточку пользователя!',
      cidescription: {
        header: 'Помощь по команде: карточка',
        commandForm: '.карточка <пользователь?>',
        rules: '<пользователь?> необязателен',
        initExamples() {
          return [
            `.карточка <@205085626880491520>`,
            `.карточка Nexus`,
            `.карточка 20508562688049152`,
          ];
        },
      },
      args: [
        {
          index: 0,
          id: 'targetMember',
          type: 'member',
          name: 'пользователь',
          default: (message: Message) => message.member,
        },
      ],
    });
  }

  async exec(
    { member, channel, guild }: Message,
    {
      targetMember,
    }: {
      targetMember: GuildMember;
    }
  ): Promise<void> {
    channel.send(await CiCardsProfile.createDefaultCard(targetMember));
    return;
  }
}
