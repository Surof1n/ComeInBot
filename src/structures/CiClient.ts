import { CiCommand, CiCommandHandler } from '@akairo';
import { GuildEntity, MemberEntity, TransferReactionEntity } from '@entity';
import { CiTimeout } from '@utils';
import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { GuildMember } from 'discord.js';

import { join } from 'path';

import { CiOptions } from '../config';

export class CiClient extends AkairoClient {
  commandHandler: CiCommandHandler;
  eventHandler: ListenerHandler;
  inhibitorHandler: InhibitorHandler;

  constructor() {
    super({
      disableMentions: 'everyone',
      messageCacheMaxSize: 300,
    });

    this.commandHandler = new CiCommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: CiOptions.prefix,
    });
    this.eventHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'events'),
    });
    this.inhibitorHandler = new InhibitorHandler(this, {
      directory: join(__dirname, '..', 'inhibitors'),
    });

    this.commandHandler.resolver.addType('CiMembers', (message, phrase) => {
      if (!phrase || !message) return null;
      if (phrase.includes('всем')) return 'всем';
      const members = phrase
        .split(' ')
        .map((item) =>
          message.guild.members.cache.find((member) =>
            this.util.checkMember(item, member, false, true)
          )
        )
        .filter((m) => m.id != message.author.id)
        .filter((m) => m);
      if (members.length > 1) return members;
      else if (members.length == 1 && !(members[0] instanceof GuildMember)) {
        const member = message.guild.members.cache.find((member) =>
          this.util.checkMember(phrase, member, false, true)
        );
        if (!member) return null;
        if (member?.id == message.author.id) return null;
        return member;
      } else if (members[0] instanceof GuildMember) {
        const member = members[0];
        if (!member) return null;
        if (member?.id == message.author.id) return null;
        return member;
      }
      return null;
    });

    this.commandHandler.resolver.addType('CiMembersAuthor', (message, phrase) => {
      if (!phrase || !message) return null;
      if (phrase.includes('всем')) return 'всем';
      const members = phrase
        .split(' ')
        .map((item) =>
          message.guild.members.cache.find((member) =>
            this.util.checkMember(item, member, false, true)
          )
        )
        .filter((m) => m);
      if (members.length > 1) return members;
      else if (members.length == 1 && !(members[0] instanceof GuildMember)) {
        const member = message.guild.members.cache.find((member) =>
          this.util.checkMember(phrase, member, false, true)
        );
        if (!member) return null;
        return member;
      } else if (members[0] instanceof GuildMember) {
        const member = members[0];
        return member;
      }
      return null;
    });

    this.eventHandler.setEmitters({
      commandHandler: this.commandHandler,
      eventHandler: this.eventHandler,
    });

    this.commandHandler.useListenerHandler(this.eventHandler);
    this.commandHandler.useInhibitorHandler(this.inhibitorHandler);
    this.inhibitorHandler.loadAll();
    this.eventHandler.loadAll();
    this.commandHandler.loadAll();
  }

  async init() {
    await this.login(CiOptions.token);
    return this;
  }
  async initData() {
    return new Promise(() => {
      setTimeout(async () => {
        const allEntityMembers = await MemberEntity.find();
        const allEntityGuilds = await GuildEntity.find();
        const allEntityReactTransfer = await TransferReactionEntity.find();
        for await (const guild of this.guilds.cache.array()) {
          guild.init(allEntityGuilds.find((entityGuild) => entityGuild.id === guild.id));

          for await (const member of guild.members.cache.array()) {
            member.init(allEntityMembers.find((entityMember) => entityMember.id === member.id));
          }

          for await (const reactEntityItem of allEntityReactTransfer) {
            const fChannel = guild.channels.cache.get(
              reactEntityItem.channelMessageId
            ) as TextChannel;
            fChannel.messages
              .fetch(reactEntityItem.messageId)
              .then((m) => console.log('Fetching success', m.id))
              .catch((e) => console.log(e));
          }

          new CiTimeout()._init(this, guild);
        }
        console.log('Connect Come In Resources 🔥🔥🔥');
      }, 1000);
    });
  }
}
