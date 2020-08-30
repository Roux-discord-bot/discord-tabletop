import { DiscordClient } from "../core/discord/classes/discord-client";
import { DiscordEvent } from "../core/discord/classes/discord-event";
import { LoggerService } from "../core/utils/logger/logger-service";

export class DiscordReadyEvent extends DiscordEvent {
	public async assignEventsToClient(client: DiscordClient): Promise<void> {
		client.on(`ready`, () => {
			LoggerService.getInstance().info({
				context: `Event - Ready`,
				message: `Bot is ready to go !`,
			});
		});
	}
}
