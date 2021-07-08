import { CiCommand } from '@akairo';
import { GuildEntity, MemberEntity } from '@entity';
import { messages } from '@resources';
import { CiEmbed } from '@structures';
import { Message } from 'discord.js';
const MAX_PROFILE_LENGTH = 170;

export default class GuildAboutMember extends CiCommand {
  constructor() {
    super({
      aliases: ['aboutme', 'обомне', 'осебе'],
      category: 'settings',
      description: 'Измени информацию о себе.',
      args: [
        {
          index: 0,
          id: 'newAboutMe',
          type: 'string',
          name: 'текст',
          match: 'content',
          default: '',
        },
      ],
    });
  }
  async exec({ member, channel, guild }: Message, { newAboutMe }: { newAboutMe: string }) {
    if (newAboutMe.length <= MAX_PROFILE_LENGTH) {
      if (newAboutMe) {
        member.aboutValue = newAboutMe;
        const bodyEmbed = messages.alter_profile_info.randomitem();
        channel.send(
          new CiEmbed().success(
            'Вы сменили информацию о себе',
            '',
            bodyEmbed.text,
            bodyEmbed.author
          )
        );
      } else {
        member.aboutValue = '';
        const bodyEmbed = messages.alter_profile_info.randomitem();
        channel.send(
          new CiEmbed().success(
            'Вы сбросили информацию о себе',
            '',
            bodyEmbed.text,
            bodyEmbed.author
          )
        );
      }
    } else {
      channel.send(
        new CiEmbed().error(
          'При смене информации о себе произошла ошибка!',
          '',
          `Введёная строка привышает ${MAX_PROFILE_LENGTH} символов.`
        )
      );
      return;
    }
    return;
  }
}
