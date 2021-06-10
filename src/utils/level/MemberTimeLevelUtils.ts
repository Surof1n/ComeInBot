import { GuildMember } from 'discord.js';
import * as moment from 'moment';

export class MemberTimeLevelUtils {
  static levelUpdate(targetMember: GuildMember) {
    const roleMemberlvlPart1 = '846794357235515413';
    const roleMemberlvlPart2 = '846794339069591591';
    const roleMemberlvlPart3 = '846794679999397908';
    const memberJoinDate = moment(targetMember.joinedAt as Date);
    const nowDate = moment();
    const memberActiveCountSpark =
      targetMember.guild.economy.voicePerCount * targetMember.timeController.minutesState +
      targetMember.guild.economy.msgPerCount * targetMember.economyController.messagesCount;
    try {
      if (
        memberActiveCountSpark >= 50000 &&
        memberActiveCountSpark < 150000 &&
        nowDate.diff(memberJoinDate, 'months') >= 1 &&
        targetMember.roles.cache.has(roleMemberlvlPart1) &&
        !targetMember.roles.cache.has(roleMemberlvlPart2)
      ) {
        targetMember.roles.remove(roleMemberlvlPart1);
        targetMember.roles.add(roleMemberlvlPart2);
      } else if (
        memberActiveCountSpark >= 150000 &&
        nowDate.diff(memberJoinDate, 'months') >= 3 &&
        targetMember.roles.cache.has(roleMemberlvlPart2) &&
        !targetMember.roles.cache.has(roleMemberlvlPart3)
      ) {
        targetMember.roles.remove(roleMemberlvlPart2);
        targetMember.roles.add(roleMemberlvlPart3);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
