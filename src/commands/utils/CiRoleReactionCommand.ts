import { Message, GuildMember } from 'discord.js';
import { CiEmbed } from '@structures';
import { messages } from '@resources';
import { randomInt } from 'crypto';
import { CiCommand } from '@akairo';
import { Guild } from 'discord.js';
import { Channel } from 'discord.js';
import { GuildEntity } from '@entity';
import { TextChannel } from 'discord.js';
import { Role } from 'discord.js';
import { Emoji } from 'discord.js';
import { GuildEmoji } from 'discord.js';

export default class GuildCommandRoleReaction extends CiCommand {
  constructor() {
    super({
      aliases: ['rolereaction', 'рольпореакции'],
      category: 'utils',
      description: 'добавь на сообщение реакцию для выдачи роли!',
      args: [
        {
          index: 0,
          id: 'messageToReact',
          type: 'guildMessage',
        },
        {
          index: 1,
          id: 'guildroleToReact',
          type: 'role',
        },
        {
          index: 2,
          id: 'reactToGive',
          type: 'string',
        },
        {
          index: 3,
          id: 'secondsForRole',
          type: (message: Message, timeExpr: string) => {
            const units = { h: 3600, m: 60, s: 1 };
            const regex = /(\d+)([hms])/g;

            let seconds = 0;
            let match: RegExpExecArray;
            while ((match = regex.exec(timeExpr))) {
              if (match[2] == 'h' || match[2] == 'm' || match[2] == 's') {
                seconds += parseInt(match[1]) * units[match[2]];
              }
            }
            return seconds;
          },
        },
        {
          index: 4,
          id: 'costroleToReact',
          type: 'number',
        },
        {
          index: 5,
          id: 'typecostroleToReact',
          type: 'string',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild }: Message,
    {
      messageToReact,
      guildroleToReact,
      reactToGive,
      secondsForRole,
      costroleToReact,
      typecostroleToReact,
    }: {
      messageToReact: Message;
      guildroleToReact: Role;
      reactToGive: GuildEmoji;
      secondsForRole: number;
      costroleToReact: number;
      typecostroleToReact: number;
    }
  ): Promise<void> {
    return;
  }
}
