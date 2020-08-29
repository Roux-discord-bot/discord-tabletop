import _ from "lodash";
import { DiscordLogEvent } from "../classes/discord-log-event";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import { DiscordEventRepository } from "../repositories/discord-event-repository";
import { DiscordCommandErrorEvent } from "../classes/discord-command-error-event";

export class DiscordEventService {
	private static _instance: DiscordEventService;

	public static getInstance(): DiscordEventService {
		if (_.isNil(DiscordEventService._instance))
			DiscordEventService._instance = new DiscordEventService();

		return DiscordEventService._instance;
	}

	private readonly _repository = new DiscordEventRepository();

	public async init({ events }: IDiscordConfig): Promise<void> {
		await this._repository.build(events);
		await this.getRepository().registerEventHandler(new DiscordLogEvent());
		await this.getRepository().registerEventHandler(
			new DiscordCommandErrorEvent()
		);
	}

	public getRepository(): DiscordEventRepository {
		return this._repository;
	}
}
