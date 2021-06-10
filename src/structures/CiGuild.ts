import { Guild } from 'discord.js';
import { CiClient, GuildTempChannelsManager } from '@structures';
import {
  CiGuildOptionsDonate,
  CiGuildOptionsEconomy,
  CiGuildOptionsReputation,
  CiGuildReportOptions,
  StartCiGuildOptions,
} from '../config';
import { GuildEntity } from '@entity';
import { CiGuildOptions, CiGuildEconomy, CiGuildDonate } from '@typings';
import { CiGuildReportsManager } from './CiGuildReportsManager';

export class CiGuild extends Guild {
  options: CiGuildOptions;
  economy: CiGuildEconomy;
  donate: CiGuildDonate;
  report: CiGuildReportsManager;
  constructor(client: CiClient, data: Record<string, unknown>) {
    super(client, data);
    this.options;
    this.economy;
    this.donate;
    this.report;
  }
  public async init(dataGuildEntity: GuildEntity): Promise<void> {
    if (!dataGuildEntity) {
      dataGuildEntity = new GuildEntity();
      dataGuildEntity.id = this.id;
    }

    if (!dataGuildEntity.options) {
      dataGuildEntity.options = StartCiGuildOptions;
    }

    if (!dataGuildEntity.economy) {
      dataGuildEntity.economy = CiGuildOptionsEconomy;
    }

    if (!dataGuildEntity.reputation) {
      dataGuildEntity.reputation = CiGuildOptionsReputation;
    }

    if (!dataGuildEntity.donate) {
      dataGuildEntity.donate = CiGuildOptionsDonate;
    }

    if (!dataGuildEntity.report) {
      dataGuildEntity.report = CiGuildReportOptions;
    }

    this.options = dataGuildEntity.options;
    this.economy = dataGuildEntity.economy;
    this.reputation = dataGuildEntity.reputation;
    this.donate = dataGuildEntity.donate;
    this.report = new CiGuildReportsManager(this, dataGuildEntity.report);
    this.tempChannels = new GuildTempChannelsManager();

    dataGuildEntity.save();
    return;
  }
}
