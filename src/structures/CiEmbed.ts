import { PrefixSupplier } from 'discord-akairo';
import { GuildMember, MessageEmbed, MessageEmbedOptions, TextChannel } from 'discord.js';
import { Colors, Icons } from '../config';

export class CiEmbed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data);
  }

  public create(
    author?: string,
    header?: string,
    description?: string,
    footer?: string,
    icon?: string
  ): CiEmbed {
    const embed = new CiEmbed();
    author ? embed.setAuthor(author, icon) : false;
    header ? (embed.title = header) : false;
    footer ? embed.setFooter(footer) : false;
    description ? embed.setDescription(description) : false;
    return embed;
  }

  public error(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.error).setColor(Colors.Red);
  }

  public warn(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.warning).setColor(Colors.Yellow);
  }

  public success(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.success).setColor(Colors.Green);
  }

  public info(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.info).setColor(Colors.Blue);
  }

  public errorCommandEconomyValue(prefix: string | string[] | PrefixSupplier) {
    return this.info(
      'Вам нехватает валюты для покупки!',
      null,
      `**Ознакомтесь с командой:**\nВведите ${prefix}help`,
      `В случае повторной ошибки обратитесь к администратору.`
    );
  }
  public errorRoleReactEconomyValue() {
    return this.info(
      'Вам нехватает валюты для покупки!',
      null,
      null,
      `В случае повторной ошибки обратитесь к администратору.`
    );
  }
  public errorCommandValue(prefix: string | string[] | PrefixSupplier) {
    return this.error(
      'Ошибка! Неправильный параметр команды.',
      null,
      `**Ознакомтесь с командой:**\nВведите ${prefix}help`,
      `В случае повторной ошибки обратитесь к администратору.`
    );
  }
  public errorCommandValueReason(prefix: string | string[] | PrefixSupplier, reason: string) {
    return this.error(
      'Ошибка! Неправильный параметр команды.',
      reason,
      `**Ознакомтесь с командой:**\nВведите ${prefix}help`,
      `В случае повторной ошибки обратитесь к администратору.`
    );
  }

  public reportMessageSpam(memberName: GuildMember, channelName: TextChannel) {
    return this.info(
      'Выдано нарушение!',
      null,
      `Пользователь ${memberName} выслал более 5 сообщений за 5 секунд, канал: ${channelName} сообщения:`
    );
  }
}
