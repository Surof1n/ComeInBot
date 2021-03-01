import { Message, GuildMember } from "discord.js";
import { Command } from "discord-akairo";
import { CiEmbed } from "@structures";
import { Collection } from "discord.js";
import { Snowflake } from "discord.js";

export default class SendCommand extends Command {
  constructor() {
    super("начислить", {
      aliases: ["начислить", "Pay"],
      args: [
        {
          index: 0,
          id: "count",
          type: "number"
        },
        {
          index: 1,
          id: "receiver",
          type: "string"
        },
        {
          index: 2,
          id: "receiver",
          match: "content",
          type: "CiMembers"
        }
      ]
    });
  }

  async exec(
    message: Message,
    { count, valueType, receiver }: { count: number; valueType: string; receiver: GuildMember[] | GuildMember }
  ) {
    const { member, content, channel, guild } = message;
    
    count = Math.round(count)
    const positive = count > 0
    const action = positive ? "начислили" : "списали"
    count = positive ? count : -count

    if (valueType === guild.economy.emoji) {
      
    }
  }
}
