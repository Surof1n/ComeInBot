import { CiCommand } from '@akairo';
import { CiEmbed } from '@structures';
import { Collection } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { User } from 'discord.js';
import { Message } from 'discord.js';
import { Categoryes, CategoryesIcon, Icons } from '../../config';

export default class HelpCommand extends CiCommand {
  constructor() {
    super({
      description: 'справочник по вызову для справки по командам',
      category: 'utils',
      aliases: ['help', 'помощь'],
      args: [
        {
          index: 0,
          type: 'string',
          id: 'command',
          default: null,
        },
      ],
    });
  }
  async exec({ member, channel, guild, author }: Message, { command }: { command: string }) {
    const categoryes = this.client.commandHandler.categories;
    if (command) {
      const parseCommand = this.client.commandHandler.findCommand(command) as CiCommand;
      if (!parseCommand) {
        channel.send(new CiEmbed().info('Команда не найдёна!'));
        return;
      }
      parseCommand.cidescription ? parseCommand.cidescription.initExamples(guild) : false;
      const helpEmbed = new CiEmbed().create(
        `Помощь по модулю ${Categoryes.get(parseCommand.categoryID)}`,
        `Помощь по команде \`${this.prefix}${parseCommand.id}\``,
        null,
        null,
        `${CategoryesIcon.get(parseCommand.category.id)}`
      );
      parseCommand.description
        ? helpEmbed.addField('Описание:', `${parseCommand.description}`)
        : false;
      parseCommand.cidescription?.commandForm
        ? helpEmbed.addField('Использование:', `${parseCommand.cidescription.commandForm}`)
        : false;
      parseCommand.cidescription?.rules
        ? helpEmbed.addField('Правила использования:', `${parseCommand.cidescription.rules}`)
        : false;
      parseCommand.cidescription?.examples
        ? helpEmbed.addField(
            'Примеры использования:',
            `${parseCommand.cidescription.examples.join('\n')}`
          )
        : false;
      parseCommand.aliases
        ? helpEmbed.addField(
            'Иные названия:',
            `${parseCommand.aliases.map((item) => `\`\`${item}\`\``).join(', ')}`
          )
        : false;
      await channel.send(helpEmbed);
      return;
    }
    const emojiRight = '▶️',
      emojiLeft = '◀️';
    let sliderIndex = 0;
    const categoryesNames: string[] = categoryes.keyArray();

    const helpEmbed = categoryesNames.map((category, index) => {
      const commands = this.client.commandHandler.categories.get(category).array();
      const embed = new CiEmbed().create(
        `Помощь по модулю ${Categoryes.get(category)}`,
        '',
        `${commands
          .map((command) => `**⏵ ${command.aliases[0]}** — ${command.description} \n\n`)
          .join(' ')}`,
        `\n${this.prefix}help <команда> для подробностей\nСтраница ${index + 1}/${
          categoryesNames.length
        }`,
        `${CategoryesIcon.get(category)}`
      );

      return embed;
    });
    const embedMessage = await channel.send(helpEmbed[sliderIndex]);

    for (const e of [emojiLeft, emojiRight]) embedMessage.react(e);

    const emojiListCollector = embedMessage.createReactionCollector(
      (reaction: MessageReaction, user: User) => user.id === author.id,
      { time: 120000 }
    );

    emojiListCollector.on('collect', async (react, user) => {
      if (react.emoji.name === emojiRight) {
        sliderIndex === helpEmbed.length - 1 ? (sliderIndex = 0) : (sliderIndex += 1);
      } else if (react.emoji.name === emojiLeft) {
        sliderIndex == 0 ? (sliderIndex = helpEmbed.length - 1) : (sliderIndex -= 1);
      } else {
        return embedMessage.delete();
      }
      await embedMessage.edit(helpEmbed[sliderIndex]);
      react.users.remove(user);
    });
  }
}
