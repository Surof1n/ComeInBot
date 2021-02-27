import { Guild, GuildMember } from "discord.js";
import { MemberEntity } from "@entity"
export class EconomyController {
  member: GuildMember;
  guild: Guild;
  count: number;
  constructor(member: GuildMember, count: number) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
  }

  async add(addCount: number, reason: string) {
    // TODO: Create Transferm Form
    if (addCount <= 0) return false;
    this.count = this.count + addCount;
    MemberEntity.update({ id: this.member.id }, { moneyCount: this.count });
    return true;
  }
  async remove(removeCount: number, reason: string) {
    // TODO: Create Transferm Form
    if (removeCount <= 0 || this.count - removeCount >= 0) return false;
    this.count = this.count - removeCount;
    MemberEntity.update({ id: this.member.id }, { moneyCount: this.count });
    return true;
  }
  async send(sendCount: number, receiverMember: GuildMember, reason: string) {
    if (await this.remove(sendCount, "Send Spark")) {
      return receiverMember.economyController.add(
        sendCount,
        "Receivering Spark"
      );
    }
    return false;
  }

  get sparkCount() {
    return this.count;
  }
}
