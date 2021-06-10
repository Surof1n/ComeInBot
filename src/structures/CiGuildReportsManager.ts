import { GuildEntity } from '@entity';
import { CiGuildReport } from '@typings';
import { Guild, GuildMember } from 'discord.js';

export class CiGuildReportsManager {
  private options: CiGuildReport;
  private guild: Guild;
  private _reportManagers: GuildMember[];
  constructor(guild: Guild, guildReportOption: CiGuildReport) {
    this.options = guildReportOption;
    this.guild = guild;
    this._reportManagers = guildReportOption.reportManagers.map((item) => guild.member(item));
  }

  async addMember(member: GuildMember) {
    if (!member) return false;
    const guildEntity = await GuildEntity.findOne({ id: this.guild.id });
    this._reportManagers.push(member);
    guildEntity.report.reportManagers = this.membersID;
    await guildEntity.save();
  }
  async removeMember(member: GuildMember) {
    if (!member) return false;
    const guildEntity = await GuildEntity.findOne({ id: this.guild.id });
    this._reportManagers = this._reportManagers.filter((item) => item.id !== member.id);
    guildEntity.report.reportManagers = this.membersID;
    await guildEntity.save();
  }
  get membersID() {
    return this._reportManagers.map((item) => item.id);
  }

  hasMember(member: GuildMember) {
    return this._reportManagers.includes(member);
  }
  get reportManagers() {
    return this._reportManagers;
  }
}
