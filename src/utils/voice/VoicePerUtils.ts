import { GuildMember, VoiceState } from 'discord.js';
import * as moment from 'moment';

export class VoicePerUttils {
  static addPerMoney(member: GuildMember) {
    const stateTime = moment();
    const calculatedMinuts = Math.floor(
      stateTime.diff(member.timeController.startDate || stateTime, 'minute')
    );
    const moneyForSpeaking = calculatedMinuts * member.guild.economy.voicePerCount;
    member.timeController.minutesState += calculatedMinuts;
    member.economyController.add(moneyForSpeaking, null);
  }
  static conservationStarts(state: VoiceState) {
    if (state.member.timeController.startDate !== null) {
      state.member.timeController.startDate = null;
    }
    const notDeafenedUsers = state.channel?.members.filter((m) => !m.user.bot && !m.voice.deaf);
    if (notDeafenedUsers?.size >= 2)
      notDeafenedUsers
        .filter((m) => m.timeController.startDate === null)
        .forEach((m) => (m.timeController.startDate = moment().toDate()));
  }
  static conservationEnds(state: VoiceState, triggerMember: GuildMember) {
    this.addPerMoney(triggerMember);
    triggerMember.timeController.startDate = null;

    const remainingMembers = state.channel?.members.filter((m) => !m.user.bot && !m.voice.deaf);

    if (remainingMembers.size === 1) {
      const lastMember = remainingMembers.first();
      if (lastMember) {
        this.addPerMoney(lastMember);
        lastMember.timeController.startDate = null;
      }
    }
  }
}
