import { CiDescription } from '@typings';
import { Command, CommandOptions } from 'discord-akairo';
import { Message } from 'discord.js';

export class CiCommand extends Command {
  public cidescription: CiDescription;
  constructor(options: CommandOptions) {
    super(options.aliases[0], options);
    this.cidescription = options.cidescription;
    this.prefix = process.env.PREFIX;
  }
  before(message: Message) {
    this.cidescription.examples = this.cidescription.initExamples(message);
  }
}
