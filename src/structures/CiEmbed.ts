import { MessageEmbedOptions, MessageEmbed } from "discord.js";
import { Colors, Icons } from "../config";

export class CiEmbed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data)
  }

  public create(header?: string, description?: string, icon?: string): CiEmbed {
    const embed = header ? this.setAuthor(header, icon) : new CiEmbed()
    return description ? embed.setDescription(description): embed
  }

  public error(header?: string, description?: string): CiEmbed {
    return this.create(header, description, Icons.error).setColor(Colors.Red)
  }

  public warn(header?: string, description?: string): CiEmbed {
    return this.create(header, description, Icons.warning).setColor(Colors.Yellow)
  }

  public success(header?: string, description?: string): CiEmbed {
    return this.create(header, description, Icons.success).setColor(Colors.Green)
  }

  public info(header?: string, description?: string): CiEmbed {
    return this.create(header, description, Icons.info).setColor(Colors.Blue)
  }

}