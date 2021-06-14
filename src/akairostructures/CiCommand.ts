import { CiClient } from '@structures';
import { CiDescription } from '@typings';
import { Command, CommandOptions } from 'discord-akairo';
import { Message } from 'discord.js';

export class CiCommand extends Command {
  public cidescription: CiDescription;
  public declare client: CiClient;
  constructor(options: CommandOptions) {
    super(options.aliases[0], options);
    this.cidescription = options.cidescription;
    this.prefix = process.env.PREFIX;
    this.argsInOptions = options.args;
  }
}
