import { GuildMember } from 'discord.js';
import * as moment from 'moment';
import { RoleLevel } from '../../config';

export class MemberTimeLevelUtils {
  static levelUpdate(targetMember: GuildMember) {
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
        targetMember.roles.cache.has(RoleLevel.roleMemberlvlPart1) &&
        !targetMember.roles.cache.has(RoleLevel.roleMemberlvlPart2)
      ) {
        targetMember.roles.remove(RoleLevel.roleMemberlvlPart1);
        targetMember.roles.add(RoleLevel.roleMemberlvlPart2);
      } else if (
        memberActiveCountSpark >= 150000 &&
        nowDate.diff(memberJoinDate, 'months') >= 3 &&
        targetMember.roles.cache.has(RoleLevel.roleMemberlvlPart2) &&
        !targetMember.roles.cache.has(RoleLevel.roleMemberlvlPart3)
      ) {
        targetMember.roles.remove(RoleLevel.roleMemberlvlPart2);
        targetMember.roles.add(RoleLevel.roleMemberlvlPart3);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
