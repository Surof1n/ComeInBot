import { Guild, GuildMember } from 'discord.js';
import { MemberEntity, TransferEntity } from '@entity';
import { REASONS } from '../config';
import { MemberTimeLevelUtils } from '@utils';
export class EconomyController {
  member: GuildMember;
  guild: Guild;
  private msgCount: number;
  private count: number;
  private monthCountTop: number;
  private allTimeCountTop: number;
  constructor(
    member: GuildMember,
    count: number,
    monthCountTop: number,
    allTimeCountTop: number,
    msgCount: number
  ) {
    this.member = member;
    this.guild = member.guild;
    this.count = count;
    this.msgCount = msgCount;
    this.monthCountTop = monthCountTop;
    this.allTimeCountTop = allTimeCountTop;
  }
  async add(addCount: number, reason: string) {
    if (addCount <= 0) return false;
    this.count = this.count + addCount;
    this.monthCountTop = this.monthCountTop + addCount;
    this.allTimeCountTop = this.allTimeCountTop + addCount;
    MemberEntity.update(
      { id: this.member.id },
      {
        moneyCount: this.count,
        incrementMonthMoneyCount: this.monthCountTop,
        incrementMoneyCount: this.allTimeCountTop,
      }
    );
    MemberTimeLevelUtils.levelUpdate(this.member);
    return true;
  }
  async remove(removeCount: number, reason: string) {
    if (removeCount <= 0 || this.count - removeCount < 0) return false;
    this.count = this.count - removeCount;
    MemberEntity.update({ id: this.member.id }, { moneyCount: this.count });
    return true;
  }
  async send(sendCount: number, receiverMember: GuildMember, reason: string) {
    if ((await this.remove(sendCount, 'Send Spark')) && this.member.id != receiverMember.id) {
      receiverMember.economyController.add(sendCount, REASONS.RECEIVERING);

      const dataTranfer = new TransferEntity(
        this.member,
        receiverMember,
        receiverMember.guild,
        'spark',
        sendCount
      );
      dataTranfer.save();
      return true;
    }
    return false;
  }

  get sparkCount() {
    return this.count;
  }

  get sparkMonthCountTop() {
    return this.monthCountTop;
  }

  get sparkAllTimeCountTop() {
    return this.allTimeCountTop;
  }

  get messagesCount() {
    return this.msgCount;
  }
  set messagesCount(newMsg) {
    this.msgCount = newMsg;
    MemberEntity.update(
      { id: this.member.id },
      {
        messageCount: this.msgCount,
      }
    );
  }

  resetMonthSparkCount() {
    this.monthCountTop = 0;
    MemberEntity.update(
      { id: this.member.id },
      {
        incrementMonthMoneyCount: this.monthCountTop,
      }
    );
  }
}
