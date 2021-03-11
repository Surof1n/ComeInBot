import { MemberEntity, TransferEntity } from '@entity';
import { Guild, GuildMember } from 'discord.js';
import moment from 'moment-timezone';

export class ReputationController {
  member: GuildMember;
  guild: Guild;
  count: number;
  constructor(member: GuildMember, count: number) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
  }
  async send(receiverMember: GuildMember, reason: string) {
    const transfers = await TransferEntity.find({ transferReciverId: receiverMember.id });
    if (transfers.filter((transfer) => moment(transfer.transferDate))) return;
    receiverMember.reputationController.count += 1;
    MemberEntity.update(
      { id: receiverMember.id },
      { reputationCount: receiverMember.reputationController.count }
    );
    const dataTranfer = new TransferEntity(
      this.member,
      receiverMember,
      receiverMember.guild,
      'spark',
      1
    );
    dataTranfer.save();
    return true;
  }
  get repValue(): number {
    return this.count;
  }
}
