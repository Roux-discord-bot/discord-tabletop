import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordClient } from "../classes/discord-client";
import { DiscordEvent } from "../classes/discord-event";

export class DiscordLogEvent extends DiscordEvent {
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
