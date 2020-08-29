import { Message } from "discord.js";
import { DiscordEventEmitterService } from "../core/discord/services/discord-event-emitter-service";
import { DiscordCommandHandler } from "../core/discord/classes/discord-command-handler";

export class DiscordErrorCommand extends DiscordCommandHandler {
	constructor() {
		super(`error`, {
			description: `An easy way to test the commandError event`,
		});
	}

	public async handleCommand(message: Message): Promise<void> {
		DiscordEventEmitterService.getInstance().emit(
			`commandError`,
			this,
			message,
			new Error(`Totally planned error !`)
		);
	}
}
