import { Guild } from 'discord.js';
import { CiClient } from '@structures';
import { CiGuildOptionsEconomy, StartCiGuildOptions } from '../config';
import { GuildEntity } from '@entity';
import { CiGuildOptions, CiGuildEconomy } from '@typings';

export class CiGuild extends Guild {
  options: CiGuildOptions;
  economy: CiGuildEconomy;

  constructor(client: CiClient, data: Record<string, unknown>) {
    super(client, data);
    this.options;
    this.economy;
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

    this.options = dataGuildEntity.options;
    this.economy = dataGuildEntity.economy;

    dataGuildEntity.save();
    return;
  }
}
