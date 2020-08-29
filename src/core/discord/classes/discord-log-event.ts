import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordClient } from "./discord-client";
import { DiscordEventHandler } from "./discord-event-handler";

export class DiscordLogEvent extends DiscordEventHandler {
	public async assignEventsToClient(client: DiscordClient): Promise<void> {
		client
			.on(`debug`, message => {
				LoggerService.getInstance().debug({
					context: `Discord`,
					message,
				});
			})
			.on(`warn`, message => {
				LoggerService.getInstance().warn({
					context: `Discord`,
					message,
				});
			})
			.on(`error`, ({ message }) => {
				LoggerService.getInstance().error({
					context: `Discord`,
					message,
				});
			});
	}
}
