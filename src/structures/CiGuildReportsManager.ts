import { GuildEntity } from '@entity';
import { CiGuildReport } from '@typings';
import { Guild, GuildMember } from 'discord.js';

export class CiGuildReportsManager {
  public options: CiGuildReport;
  private guild: Guild;
  private _reportManagers: GuildMember[];
  private _memberHasReport: GuildMember[];
  constructor(guild: Guild, guildReportOption: CiGuildReport) {
    this.options = guildReportOption;
    this.guild = guild;
    this._reportManagers = guildReportOption.reportManagers.map((item) => guild.member(item));
    this._memberHasReport = guildReportOption.memberHasReport.map((item) => guild.member(item));
  }

  async addManager(member: GuildMember) {
    if (!member) return false;
    const guildEntity = await GuildEntity.findOne({ id: this.guild.id });
    this._reportManagers.push(member);
    guildEntity.report.reportManagers = this.managersID;
    await guildEntity.save();
  }
  async removeManager(member: GuildMember) {
    if (!member) return false;
    const guildEntity = await GuildEntity.findOne({ id: this.guild.id });
    this._reportManagers = this._reportManagers.filter((item) => item.id !== member.id);
    guildEntity.report.reportManagers = this.managersID;
    await guildEntity.save();
  }
  async addReport(member: GuildMember) {
    if (!member) return false;
    const guildEntity = await GuildEntity.findOne({ id: this.guild.id });
    this._memberHasReport.push(member);
    guildEntity.report.memberHasReport = this.membersHasReportID;
    await guildEntity.save();
  }
  async removeReport(member: GuildMember) {
    if (!member) return false;
    const guildEntity = await GuildEntity.findOne({ id: this.guild.id });
    this._memberHasReport = this._memberHasReport.filter((item) => item.id !== member.id);
    guildEntity.report.memberHasReport = this.membersHasReportID;
    await guildEntity.save();
  }
  get managersID() {
    return this._reportManagers.map((item) => item.id);
  }
  get membersHasReportID() {
    return this._memberHasReport.map((item) => item.id);
  }
  hasManager(member: GuildMember) {
    return this._reportManagers.includes(member);
  }
  memberHasReport(member: GuildMember) {
    return this._memberHasReport.includes(member);
  }
  get reportManagers() {
    return this._reportManagers;
  }
  get membersHasReport() {
    return this._memberHasReport;
  }
}
