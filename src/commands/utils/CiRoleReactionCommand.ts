import { CiCommand } from '@akairo';
import { TransferReactionEntity } from '@entity';
import { CiEmbed } from '@structures';
import { Message, NewsChannel, Role, TextChannel } from 'discord.js';

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
          name: 'сообщение',
        },
        {
          index: 1,
          id: 'guildroleToReact',
          type: 'role',
          name: 'роль',
        },
        {
          index: 2,
          id: 'reactToGive',
          type: 'string',
          name: 'реакция',
        },
        {
          index: 3,
          id: 'costroleToReact',
          type: 'number',
          name: 'стоимость',
        },
        {
          index: 4,
          id: 'typecostroleToReact',
          name: 'тип стоимости',
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
      channel.send(new CiEmbed().errorCommandValue(this.prefix));
      return;
    }
    if ((!costRole && typecostroleToReact) || (costRole && !typecostroleToReact)) {
      channel.send(
        new CiEmbed().errorCommandValueReason(this.prefix, 'Впишите стоимость и тип валюты вместе')
      );
      return;
    }
    const matchEmojiTypeCost = typecostroleToReact
      ? typecostroleToReact.emojimatcher()
      : typecostroleToReact;
    const matchReact = reactToGive.emojimatcher();

    if (!matchReact) {
      channel.send(
        new CiEmbed().error(
          'Ошибка в создании выдаваемой роли!',
          null,
          'Эмодзи для использования отсутствует'
        )
      );
      return;
    }
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
    message.fetch();
    return;
  }
}
