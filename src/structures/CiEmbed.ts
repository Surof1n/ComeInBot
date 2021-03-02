import { MessageEmbedOptions, MessageEmbed } from "discord.js";
import { Colors, Icons } from "../config";

export class CiEmbed extends MessageEmbed {
  constructor(data?: MessageEmbed | MessageEmbedOptions) {
    super(data)
  }

  public create(author?: string, header?: string, description?: string, footer?: string, icon?: string): CiEmbed {
    const embed = new CiEmbed()
    author ? embed.setAuthor(author, icon) : false
    header ? embed.title = header : false
    footer ? embed.setFooter(footer) : false 
    description ? embed.setDescription(description) : false
    return embed
  }

  public error(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.error).setColor(Colors.Red)
  }

  public warn(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.warning).setColor(Colors.Yellow)
  }

  public success(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.success).setColor(Colors.Green)
  }

  public info(author?: string, header?: string, description?: string, footer?: string): CiEmbed {
    return this.create(author, header, description, footer, Icons.info).setColor(Colors.Blue)
  }

}