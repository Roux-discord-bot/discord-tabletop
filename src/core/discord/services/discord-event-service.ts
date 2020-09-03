import _ from "lodash";
import { DiscordLogEvent } from "../events/discord-log-event";
import { DiscordEventRepository } from "../repositories/discord-event-repository";
import { DiscordCommandErrorEvent } from "../events/discord-command-error-event";

export class DiscordEventService {
	private static _instance: DiscordEventService;

	public static get INSTANCE(): DiscordEventService {
		if (_.isNil(DiscordEventService._instance))
			DiscordEventService._instance = new DiscordEventService();

		return DiscordEventService._instance;
	}

	public readonly repository = new DiscordEventRepository();

	public async init(events: string): Promise<void> {
		return this.repository
			.build(events)
			.then(() => {
				this.repository.registerDiscordEvent(new DiscordLogEvent());
			})
			.then(() => {
				this.repository.registerDiscordEvent(new DiscordCommandErrorEvent());
			});
	}
}
