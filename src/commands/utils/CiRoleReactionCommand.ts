import { CiEmbed } from '@structures';
import { messages } from '@resources';
import { randomInt } from 'crypto';
import { CiCommand } from '@akairo';
import {
  Message,
  GuildMember,
  Guild,
  Channel,
  TextChannel,
  Role,
  Emoji,
  GuildEmoji,
} from 'discord.js';
import { GuildEntity, TransferReactionEntity } from '@entity';
import { ReactTransferTypes } from 'src/config';

const CUSTOM_EMOJI_REGEX = /<(?:.*)?:(\w+):(\d+)>/;

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
          id: 'costroleToReact',
          type: 'number',
        },
        {
          index: 4,
          id: 'typecostroleToReact',
          type: 'string',
        },
      ],
    });
  }

  async exec(
    { member, channel, guild }: Message,
    {
      messageToReact: message,
      guildroleToReact: reactRole,
      reactToGive,
      costroleToReact: costRole,
      typecostroleToReact,
    }: {
      messageToReact: Message;
      guildroleToReact: Role;
      reactToGive: string;
      costroleToReact: number;
      typecostroleToReact: string;
    }
  ): Promise<void> {
    if (!message || !reactRole || !reactToGive) {
      channel.send(new CiEmbed().errorCommand(this.prefix));
      return;
    }
    if (!costRole || !typecostroleToReact) {
      typecostroleToReact = null;
      costRole = null;
    }
    const matchReact = reactToGive.emojimatcher();

    if (matchReact === guild.reputation.emoji.emojimatcher()) {
      message.channel.send(
        new CiEmbed().error(
          'Ошибка! Не используйте эмодзи теплоты!',
          null,
          `Данная ${guild.reputation.emoji} используется для системы репутации!`
        )
      );
      return;
    }
    if (
      typecostroleToReact != guild.economy.emoji &&
      typecostroleToReact != guild.donate.emoji &&
      typecostroleToReact != null
    ) {
      channel.send(new CiEmbed().errorCommand(this.prefix));
      return;
    }

    const matchEmojiTypeCost = typecostroleToReact
      ? typecostroleToReact.emojimatcher()
      : typecostroleToReact;

    const findTransfer = await TransferReactionEntity.findOne({
      react: matchReact,
      roleId: reactRole.id,
      messageId: message.id,
    });

    if (findTransfer) {
      channel.send(
        new CiEmbed().error(
          'Ошибка в создании выдаваемой роли!',
          null,
          'Такая выдаваемая роль уже созданна'
        )
      );
      return;
    }

    const reactTransfer = new TransferReactionEntity(
      message,
      reactRole,
      matchReact,
      costRole,
      matchEmojiTypeCost
    );
    channel.send(
      new CiEmbed()
        .info('Создание выдаваемой роли прошло успешно', null, null, null)
        .addField('На сервере:', guild.name)
        .addField('Сообщение:', `[Нажми на меня.](${message.url})`)
        .addField('Роль:', reactRole)
        .addField('Эмоция:', reactToGive)
        .addField(
          'Стоймость и валюта:',
          `${costRole ? costRole : 'Бесплатно'} ${typecostroleToReact ? typecostroleToReact : ''}`
        )
    );
    message.react(reactToGive);
    reactTransfer.save();
    return;
  }
}
