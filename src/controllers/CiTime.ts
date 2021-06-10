import { MemberEntity } from '@entity';
import { GuildMember } from 'discord.js';

export class TimeController {
  private member: GuildMember;
  private voiceStartDate: Date;
  private voiceMinutesState: number;
  constructor(member: GuildMember, voiceStartDate: Date, voiceMinutesState: number) {
    this.member = member;
    this.voiceStartDate = voiceStartDate;
    this.voiceMinutesState = voiceMinutesState;
  }

  set startDate(timeDate: Date) {
    this.voiceStartDate = timeDate;
    MemberEntity.update({ id: this.member.id }, { voiceStartDate: this.voiceStartDate });
  }
  get startDate() {
    return this.voiceStartDate;
  }
  set minutesState(newMinutesState: number) {
    this.voiceMinutesState = newMinutesState;
    MemberEntity.update({ id: this.member.id }, { voiceMinutesState: this.voiceMinutesState });
  }
  get minutesState() {
    return this.voiceMinutesState;
  }
}
