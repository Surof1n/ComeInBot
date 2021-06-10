import { CiListener } from '@akairo';
import { MemberEntity } from '@entity';
import { GuildMember } from 'discord.js';

export default class GuildMemberAddEvent extends CiListener {
  constructor() {
    super('guildMemberAdd', {
      emitter: 'client',
      event: 'guildMemberAdd',
    });
  }

  async exec(member: GuildMember) {
    member.init(await MemberEntity.findOne({ id: member.id }));
  }
}
