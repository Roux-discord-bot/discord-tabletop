import { LoggerService } from "src/core/utils/logger/logger-service";
import { DiscordClient } from "./discord-client";
import { DiscordEventHandler } from "./discord-event-handler";

export class DiscordLogEvent extends DiscordEventHandler {
	public async assignEventsToClient(client: DiscordClient): Promise<void> {
		client
			.on(`debug`, message => {
				LoggerService.getInstance().debug({
					context: `DiscordLogEvent`,
					message,
				});
			})
			.on(`warn`, message => {
				LoggerService.getInstance().warn({
					context: `DiscordLogEvent`,
					message,
				});
			})
			.on(`error`, ({ message }) => {
				LoggerService.getInstance().error({
					context: `DiscordLogEvent`,
					message,
				});
			});
	}
}
