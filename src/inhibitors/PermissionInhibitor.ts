import { CiInhibitor } from '@akairo';
import { Message } from 'discord.js';

export default class PermissionInhibitor extends CiInhibitor {
  constructor() {
    super('permission', {
      reason: 'permission',
    });
  }

  async exec(message: Message): Promise<boolean> {
    const parsingMessage = await this.client.commandHandler.parseCommand(message);
    return false;
  }
}
