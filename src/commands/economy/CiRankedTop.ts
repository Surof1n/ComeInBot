import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { Collection } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';
import { Message } from 'discord.js';
import { Categoryes, CategoryesIcon, Icons } from '../../config';

export default class HelpCommand extends CiCommand {
  constructor() {
    super({
      description: 'справочник по вызову для справки по командам',
      category: 'utils',
      aliases: ['help', 'помощь'],
      args: [
        {
          index: 0,
          type: 'string',
          id: 'command',
          default: null,
        },
      ],
    });
  }
  async exec({ member, channel, guild, author }: Message, { command }: { command: string }) {
    return;
  }
}
