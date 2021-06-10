import { MemberEntity, TransferEntity } from '@entity';
import { Guild, GuildMember } from 'discord.js';
import * as moment from 'moment';

export class ReputationController {
  member: GuildMember;
  guild: Guild;
  count: number;
  rankedCount: number;
  constructor(member: GuildMember, count: number, rankedCount: number) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
    this.rankedCount = rankedCount;
  }
  async send(receiverMember: GuildMember, reason: string) {
    if (receiverMember.user.bot) return false;
    const transfers = await TransferEntity.find({
      transferMemberId: this.member.id,
      transferReciverId: receiverMember.id,
      transferType: 'reputation',
    });
    if (
      transfers.find((transfer) => moment().diff(moment(transfer.transferDate), 'days', true) < 1)
    ) {
      return false;
    }
    receiverMember.reputationController.count += 1;
    receiverMember.reputationController.rankedCount += 1;
    MemberEntity.update(
      { id: receiverMember.id },
      {
        reputationCount: receiverMember.reputationController.count,
        rankedReputationCount: receiverMember.reputationController.rankedCount,
      }
    );
    const dataTranfer = new TransferEntity(
      this.member,
      receiverMember,
      receiverMember.guild,
      'reputation',
      1
    );
    dataTranfer.save();
    return true;
  }

  public mouthUpdate() {
    this.count = 0;
    MemberEntity.update(
      { id: this.member.id },
      {
        reputationCount: this.count,
      }
    );
  }
  get repValue(): number {
    return this.count;
  }
  get allTimeRepValue(): number {
    return this.rankedCount;
  }
}
