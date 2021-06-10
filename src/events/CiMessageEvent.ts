import { CiListener } from '@akairo';
import { CiEmbed } from '@structures';
import { TextChannel } from 'discord.js';
import { Message, User } from 'discord.js';
import * as moment from 'moment';
import { Moment } from 'moment';
interface MiniMessage {
  id: string;
  author: string;
  content: string;
  dieAt: Moment;
  warned: boolean;
  classauthor: User;
}

export default class MessageEvent extends CiListener {
  private messageCache: Map<string, MiniMessage[]> = new Map();
  private getMiniMessage(message: Message): MiniMessage {
    return {
      id: message.id,
      author: message.author.id,
      content: message.content,
      warned: false,
      dieAt: moment().add(5, 'seconds'),
      classauthor: message.author,
    };
  }
  constructor() {
    super('message', {
      emitter: 'client',
      event: 'message',
    });
  }

  async exec(message: Message) {
    const { member, channel, guild, content } = message;

    const parsingMessage = await this.client.commandHandler.parseCommand(message);

    if (member.user.bot) {
      try {
        // message.delete({ timeout: 20000 });
        return;
      } catch (error) {}
    }
    if (parsingMessage.prefix) return;
    member.economyController.add(guild.economy.msgPerCount, 'Spark add from MessageEvent');
    member.economyController.messagesCount += 1;

    const cacheKey = `${guild.id}-${message.author.id}`;
    const before = this.messageCache.get(cacheKey) as MiniMessage[];

    this.messageCache.set(
      cacheKey,
      before
        ? before.filter((m) => moment().isBefore(m.dieAt)).concat(this.getMiniMessage(message))
        : [this.getMiniMessage(message)]
    );

    const afterUpdateMessages = this.messageCache
      .get(cacheKey)
      .filter((item) => !item.warned) as MiniMessage[];
    if (afterUpdateMessages.length > 5) {
      const logChannel = guild.channels.cache.get(guild.options.logchannel) as TextChannel;
      if (logChannel) {
        logChannel.send(new CiEmbed().reportMessageSpam(member, channel as TextChannel));
        afterUpdateMessages.forEach((afterMiniMessage, index) => {
          const afterMessage = channel.messages.cache.get(afterMiniMessage.id);
          logChannel.send(
            new CiEmbed().info(
              `Вывожу ${index + 1}-ое сообщение`,
              null,
              `${afterMessage.content}`,
              `ID: ${afterMessage.id}`
            )
          );
        });
      }
      this.messageCache.set(
        cacheKey,
        afterUpdateMessages.map((m) => {
          m.warned = true;
          return m;
        })
      );
    }
  }
}
