import _ from "lodash";
import { Client } from "discord.js";
import { getInstancesFromFolder } from "../../functions/recursive-get-classes-dir";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordEventHandler } from "../features/discord-event-handler";
import { DiscordClientService } from "./discord-client-service";
import { IDiscordConfig } from "../interfaces/discord-config-interface";

export class DiscordEventService {
	private static _instance: DiscordEventService;

	public static getInstance(): DiscordEventService {
		if (_.isNil(DiscordEventService._instance))
			DiscordEventService._instance = new DiscordEventService();

		return DiscordEventService._instance;
	}

	public async init({ events }: IDiscordConfig): Promise<void> {
		const client = DiscordClientService.getInstance().getClient();
		const eventHandlers = await getInstancesFromFolder<DiscordEventHandler>(
			events
		);
		return this._registerEachEventHandlersOnClient(eventHandlers, client);
	}

	private _registerEachEventHandlersOnClient(
		eventHandlers: DiscordEventHandler[],
		client: Client
	): void | PromiseLike<void> {
		return new Promise(resolve => {
			eventHandlers.forEach(eventHandler => {
				this._registerEventHandlerOnClient(eventHandler, client);
			});
			resolve();
		});
	}

	private async _registerEventHandlerOnClient(
		eventHandler: DiscordEventHandler,
		client: Client
	): Promise<void> {
		await eventHandler.assignEventsToClient(client);
		LoggerService.getInstance().info({
			context: `DiscordEventService`,
			message: `${eventHandler.constructor.name} successfully assigned to the Discord client`,
		});
	}

	public registerEventHandler(eventHandler: DiscordEventHandler): void {
		const client = DiscordClientService.getInstance().getClient();
		this._registerEventHandlerOnClient(eventHandler, client);
	}
}
