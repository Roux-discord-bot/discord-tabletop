import _ from "lodash";
import { Client, Constructable } from "discord.js";
import { LoggerService } from "../../utils/logger/logger-service";
import { recursiveReadDir } from "../../functions/recursive-read-dir";
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

	private async _fillEventHandlers(
		eventsPath: string
	): Promise<DiscordEventHandler[]> {
		const files = recursiveReadDir(eventsPath);
		if (files.length === 0) return [];
		return files
			.map(async filePath => {
				return this._importClassesFromPath(filePath);
			})
			.reduce(async (promiseAccumulator, promiseCurrent) => {
				const accumulator = await promiseAccumulator;
				const current = await promiseCurrent;
				accumulator.push(...current);
				return promiseAccumulator;
			});
	}

	private async _importClassesFromPath(
		filePath: string
	): Promise<DiscordEventHandler[]> {
		return import(filePath)
			.then(file => {
				return this._instantiateGivenClasses(file).filter(clazz => {
					return clazz instanceof DiscordEventHandler;
				});
			})
			.catch(err => {
				LoggerService.getInstance().error({
					context: `DiscordEventService`,
					message: `Error retreiving all the event handlers, reason : \n${err}`,
				});
				return Promise.reject(new Error(err));
			});
	}

	private _instantiateGivenClasses(classes: {
		[key: string]: Constructable<DiscordEventHandler>;
	}): DiscordEventHandler[] {
		return Object.keys(classes).map(cname => {
			return new classes[cname]();
		});
	}

	public async init({ events }: IDiscordConfig): Promise<void> {
		const client = DiscordClientService.getInstance().getClient();
		const eventHandlers = (await this._fillEventHandlers(events)) || [];
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
