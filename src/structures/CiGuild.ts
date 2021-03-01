import { Guild } from "discord.js";
import { CiClient } from ".";
import { CiGuildOptionsEconomy, StartCiGuildOptions } from "../config";
import { GuildEntity} from "@entity"
import { ciGuildOptions, ciGuildOptionsEconomy } from "../typings";

export class CiGuild extends Guild {
  options: ciGuildOptions;
  economy: ciGuildOptionsEconomy;

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
