import { CiCommand } from '@akairo';
import { mainGuildId } from '@typings';
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';
import { GuildMember } from 'discord.js';

import { join } from 'path';

import { CiOptions } from '../config';

export class CiClient extends AkairoClient {
  commandHandler: CommandHandler;
  eventHandler: ListenerHandler;

  constructor() {
    super({
      // TODO: ClientOptions
    });
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: CiOptions.prefix,
    });
    this.eventHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'events'),
    });
    this.commandHandler.resolver.addType('CiMembers', (message, phrase) => {
      const members: GuildMember[] = [];
      phrase.split(' ').forEach((phraseitem) => {
        members.push(
          message.guild.members.cache
            .filter((member) => this.util.checkMember(phraseitem, member, false, true))
            .array()[0]
        );
      });
      if (members.includes(undefined)) return null;
      if (members.length === 1 && members[0] instanceof GuildMember) return members[0];
      return members;
    });
    this.eventHandler.setEmitters({
      commandHandler: this.commandHandler,
      eventHandler: this.eventHandler,
    });
    this.commandHandler.useListenerHandler(this.eventHandler);
    this.eventHandler.loadAll();
    this.commandHandler.loadAll();
  }

  async init(): Promise<boolean> {
    await this.login(CiOptions.token);
    return true;
  }
}
