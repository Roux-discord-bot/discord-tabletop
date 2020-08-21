import { LoggerService } from "../utils/logger/logger-service";
import { DiscordEventHandler } from "../core/discord/features/discord-event-handler";

export class DiscordEventReady extends DiscordEventHandler {
	constructor() {
		super(`DiscordEventReady`, `ready`);
	}

	public handleEvent(): void {
		LoggerService.getInstance().info({
			context: `Event - Ready`,
			message: `Bot is ready !`,
		});
	}
}
