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
      disableMentions: 'everyone',
      messageCacheMaxSize: 100,
    });
    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: CiOptions.prefix,
    });
    this.eventHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'events'),
    });
    this.commandHandler.resolver.addType('CiMembers', (message, phrase) => {
      const members = phrase
        .split(' ')
        .map((item) =>
          message.guild.members.cache.find((member) =>
            this.util.checkMember(item, member, false, true)
          )
        )
        .filter((member) => member.id != message.author.id);
      if (members.length > 1) return members;
      else if (members.length == 1) {
        const member = message.guild.members.cache.find((member) =>
          this.util.checkMember(phrase, member, false, true)
        );
        if (member.id == message.author.id) return null;
        return member;
      }
      return null;
    });
    this.eventHandler.setEmitters({
      commandHandler: this.commandHandler,
      eventHandler: this.eventHandler,
    });
    this.commandHandler.useListenerHandler(this.eventHandler);
    this.eventHandler.loadAll();
    this.commandHandler.loadAll();
  }

  async init() {
    return this.login(CiOptions.token);
  }
}
