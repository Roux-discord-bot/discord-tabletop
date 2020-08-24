import _ from "lodash";
import { Client, Constructable } from "discord.js";
import { LoggerService } from "../../../utils/logger/logger-service";
import { recursiveReadDir } from "../../functions/recursive-read-dir";
import {
	ClientListenerActionType,
	DiscordEventHandler,
} from "../features/discord-event-handler";
import { DiscordClientService } from "./discord-client-service";

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

	public async init(eventsPath: string): Promise<void> {
		const client = DiscordClientService.getInstance().getClient();
		const eventHandlers = (await this._fillEventHandlers(eventsPath)) || [];
		return this._registerEachEventHandlersOnClient(eventHandlers, client);
	}

	private _registerEachEventHandlersOnClient(
		eventHandlers: DiscordEventHandler[],
		client: Client
	): void | PromiseLike<void> {
		return new Promise((resolve, reject) => {
			eventHandlers.forEach(eventHandler => {
				const action: ClientListenerActionType = eventHandler.getAction();
				if (this._clientHasFunctionForAction(client, action)) {
					this._registerEventHandlerOnClient(eventHandler, client, action);
				} else {
					reject(new Error(`Invalid action : ${action}`));
				}
			});
			resolve();
		});
	}

	private _clientHasFunctionForAction(
		client: Client,
		action: ClientListenerActionType
	) {
		return typeof client[action] === `function`;
	}

	private _registerEventHandlerOnClient(
		eventHandler: DiscordEventHandler,
		client: Client,
		action: ClientListenerActionType
	): void {
		const event = eventHandler.getEvent();
		client[action](event, (...args) => {
			eventHandler.handleEvent(args);
		});
		LoggerService.getInstance().info({
			context: eventHandler.constructor.name,
			message: `Registered event handler on '${event}' with action [${action}]`,
		});
	}
}
