import { AkairoClient, CommandHandler, ListenerHandler } from "discord-akairo";

import { join } from "path";

import { CiOptions } from "../config";

export class CiClient extends AkairoClient {
    commandHandler: CommandHandler;

    eventHandler: ListenerHandler;

    constructor() {
        super({
            // TODO: ClientOptions
        });

        this.commandHandler = new CommandHandler(this, {
            directory: join(__dirname, "..", "commands"),
            prefix: CiOptions.prefix,
        });
        this.eventHandler = new ListenerHandler(this, {
            directory: join(__dirname, "..", "events"),
        });
        this.commandHandler.useListenerHandler(this.eventHandler);
        this.commandHandler.loadAll();
        this.eventHandler.loadAll();
    }

    async init(): Promise<boolean> {
        this.login(CiOptions.token);
        return true;
    }
}
