import { Guild, GuildMember } from "discord.js";

export class ReputationController {
  member: GuildMember;
  guild: Guild;
  count: number;
  activeMembers: [];
  constructor(member: GuildMember, count: number) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
    this.activeMembers;
  }

  get repValue() {
    return this.count;
  }
}
