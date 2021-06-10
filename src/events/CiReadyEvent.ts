import { CiCommand, CiListener } from '@akairo';
import { GuildEntity, MemberEntity, TransferReactionEntity } from '@entity';
import { mainGuildId } from '@typings';
import { TextChannel } from 'discord.js';
import { CiTimeout } from '../utils';

export default class ReadyEvent extends CiListener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
    });
  }

  async exec() {
    await this.client.initData();
  }
}
