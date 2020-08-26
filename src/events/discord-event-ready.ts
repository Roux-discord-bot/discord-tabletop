import { Client } from "discord.js";
import { DiscordEventHandler } from "../core/discord/features/discord-event-handler";
import { LoggerService } from "../core/utils/logger/logger-service";

export class DiscordOnReadyEvent extends DiscordEventHandler {
	public async assignEventsToClient(client: Client): Promise<void> {
		client.on(`ready`, () => {
			LoggerService.getInstance().info({
				context: `Event - Ready`,
				message: `Bot is ready to go !`,
			});
		});
	}
}
