import { Guild } from "discord.js";
import { CiClient } from ".";
import { startCiGuildOptions } from "../config";
import { GuildEntity} from "@entity"
import CiGuildOptions from "../typings";

export class CiGuild extends Guild {
  GuildOptions: CiGuildOptions;

  constructor(client: CiClient, data: Record<string, unknown>) {
    super(client, data);
    this.GuildOptions;
  }
  public async init(dataGuildEntity: GuildEntity): Promise<void> {
    if (!dataGuildEntity) {
      dataGuildEntity = new GuildEntity();
      dataGuildEntity.id = this.id;
    }

    if (!dataGuildEntity.options) {
      dataGuildEntity.options = startCiGuildOptions;
    }

    this.options = dataGuildEntity.options;

    dataGuildEntity.save();
    return;
  }
}
