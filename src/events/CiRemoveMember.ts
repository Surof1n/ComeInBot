import { CiListener } from '@akairo';
import { MemberEntity } from '@entity';
import { GuildMember } from 'discord.js';

export default class GuildMemberRemoveEvent extends CiListener {
  constructor() {
    super('guildMemberRemove', {
      emitter: 'client',
      event: 'guildMemberRemove',
    });
  }

  async exec(member: GuildMember) {
    await MemberEntity.delete({ id: member.id });
  }
}
