import { DiscordClient } from "src/core/discord/classes/discord-client";
import { DiscordEventHandler } from "../core/discord/classes/discord-event-handler";
import { LoggerService } from "../core/utils/logger/logger-service";

export class DiscordReadyEvent extends DiscordEventHandler {
	public async assignEventsToClient(client: DiscordClient): Promise<void> {
		client.on(`ready`, () => {
			LoggerService.getInstance().info({
				context: `Event - Ready`,
				message: `Bot is ready to go !`,
			});
		});
	}
}
