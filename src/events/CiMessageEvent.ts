import { Message } from "discord.js";
import { CiListener } from "@akairo";

export default class MessageEvent extends CiListener {
    constructor() {
        super("message", {
            emitter: "client",
            event: "message",
        });
    }

    async exec(message: Message) {
        const { member, channel, guild, content } = message;
        const parsingMessage = await this.client.commandHandler.parseCommand(
            message
        );
        if (member.user.bot || parsingMessage.command) return;
        member.economyController.add(
            guild.options.msgPerCount,
            "Spark add from MessageEvent"
        );
    }
}
  