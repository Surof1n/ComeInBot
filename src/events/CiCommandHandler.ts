import { CiCommand, CiListener } from '@akairo';
import { TransferReactionEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Command } from 'discord-akairo';

import { Message } from 'discord.js';
import { ArgumentOptions, ArgumentGenerator } from 'discord-akairo';

export default class CiCommandStarted extends CiListener {
  constructor() {
    super('commandStarted', {
      emitter: 'commandHandler',
      event: 'commandStarted',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async exec(message: Message, command: Command, args: { [k: string]: string }) {
    return;
  }
}
