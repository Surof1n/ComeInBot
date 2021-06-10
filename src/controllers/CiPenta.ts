import { Guild, GuildMember } from 'discord.js';
import { MemberEntity, TransferEntity } from '@entity';
import { REASONS } from '../config';
export class PentaController {
  member: GuildMember;
  guild: Guild;
  private count: number;
  constructor(member: GuildMember, count: number) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
  }

  async add(addCount: number, reason: string) {
    if (addCount <= 0) return false;
    this.count = this.count + addCount;
    MemberEntity.update({ id: this.member.id }, { pentaCount: this.count });
    return true;
  }
  async remove(removeCount: number, reason: string) {
    if (removeCount <= 0 || this.count - removeCount < 0) return false;
    this.count = this.count - removeCount;
    MemberEntity.update({ id: this.member.id }, { pentaCount: this.count });
    return true;
  }
  async send(sendCount: number, receiverMember: GuildMember, reason: string) {
    if ((await this.remove(sendCount, 'Send Penta')) && this.member.id != receiverMember.id) {
      receiverMember.economyController.add(sendCount, REASONS.RECEIVERING);

      const dataTranfer = new TransferEntity(
        this.member,
        receiverMember,
        receiverMember.guild,
        'penta',
        sendCount
      );
      dataTranfer.save();
      return true;
    }
    return false;
  }

  get pentaCount() {
    return this.count;
  }

  set pentaCount(newCount: number) {
    this.count = newCount;
  }
}
