import _ from "lodash";
import { DiscordLogEvent } from "../events/discord-log-event";
import { DiscordEventRepository } from "../repositories/discord-event-repository";
import { DiscordCommandErrorEvent } from "../events/discord-command-error-event";

export class DiscordEventService {
	private static _instance: DiscordEventService;

	public static getInstance(): DiscordEventService {
		if (_.isNil(DiscordEventService._instance))
			DiscordEventService._instance = new DiscordEventService();

		return DiscordEventService._instance;
	}

	private readonly _repository = new DiscordEventRepository();

	public async init(events: string): Promise<void> {
		await this._repository.build(events);
		await this.getRepository().registerDiscordEvent(new DiscordLogEvent());
		await this.getRepository().registerDiscordEvent(
			new DiscordCommandErrorEvent()
		);
	}

	public getRepository(): DiscordEventRepository {
		return this._repository;
	}
}
