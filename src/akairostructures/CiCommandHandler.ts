import { CiEmbed } from '@structures';
import { CommandHandlerOptions } from 'discord-akairo';
import { Command } from 'discord-akairo';
import { AkairoClient } from 'discord-akairo';
import { CommandHandler } from 'discord-akairo';
import { Message } from 'discord.js';

export class CiCommandHandler extends CommandHandler {
  constructor(client: AkairoClient, options: CommandHandlerOptions) {
    super(client, options);
  }
  async runCommand(message: Message, command: Command, args: { [k: string]: string }) {
    const errorArguments = [];
    let stateErrorArguments = false;
    for await (const item of Object.entries(args)) {
      const keyArgument = item[0];
      const valueArgument = item[1];
      if (!valueArgument) {
        if (Array.isArray(command.argsInOptions)) {
          const optionArgumentItem = command.argsInOptions.find((item) => item?.id === keyArgument);
          if (typeof optionArgumentItem?.default === 'undefined') {
            errorArguments.push(`__${optionArgumentItem.name}__`);
            if (!stateErrorArguments) stateErrorArguments = true;
          }
        }
      } else {
        if (Array.isArray(command.argsInOptions)) {
          const optionArgumentItem = command.argsInOptions.find((item) => item?.id === keyArgument);
          errorArguments.push(`${optionArgumentItem.name}`);
        }
      }
    }
    if (stateErrorArguments) {
      await message.channel.send(
        new CiEmbed().error(
          'Ошибка! Неправильный параметр команды.',
          null,
          `**${command.prefix}${command.aliases[0]} ${errorArguments
            .map((item) => `<${item}>`)
            .join(' ')}**`,
          `Мы подчеркнули значения с ошибкой`
        )
      );
      return;
    }
    return await super.runCommand(message, command, args);
  }
}
