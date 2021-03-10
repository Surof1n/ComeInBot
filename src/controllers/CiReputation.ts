import { Guild, GuildMember } from 'discord.js';

export class ReputationController {
  member: GuildMember;
  guild: Guild;
  count: number;
  constructor(member: GuildMember, count: number) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
  }

  get repValue(): number {
    return this.count;
  }
}
