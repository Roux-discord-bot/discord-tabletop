import { Client, Constructable } from "discord.js";
import _ from "lodash";
import { LoggerService } from "../../../utils/logger/logger-service";
import { recursiveReadDir } from "../../functions/recursive-read-dir";
import { DiscordEventHandler } from "../events/discord-event-handler";
import { DiscordClientService } from "./discord-client-service";

export class DiscordEventService {
	private static _instance: DiscordEventService;

	public static getInstance(): DiscordEventService {
		if (_.isNil(DiscordEventService._instance))
			DiscordEventService._instance = new DiscordEventService();

		return DiscordEventService._instance;
	}

	public async fillEventHandlers(
		eventsPath: string
	): Promise<DiscordEventHandler[]> {
		const files = await recursiveReadDir(eventsPath);
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
				return this._getClassesInFile(file);
			})
			.catch(err => {
				LoggerService.getInstance().error({
					context: `DiscordEventService`,
					message: `Error retreiving all the event handlers, reason : \n${err}`,
				});
				return Promise.reject(new Error(err));
			});
	}

	private _getClassesInFile(file: {
		[key: string]: Constructable<DiscordEventHandler>;
	}): DiscordEventHandler[] {
		return Object.keys(file).map(eventHandler => {
			return new file[eventHandler]();
		});
	}

	public async init(eventsPath: string): Promise<void> {
		const eventHandlers = await this.fillEventHandlers(eventsPath);
		return new Promise((resolve, reject) => {
			const client = DiscordClientService.getInstance().getClient();
			eventHandlers.forEach(value => {
				switch (value.getAction()) {
					case `on`:
						this._on(client, value);
						break;
					case `once`:
						this._once(client, value);
						break;
					case `off`:
						this._off(client, value);
						break;
					default:
						reject(new Error(`Invalid action : ${value.getAction()}`));
				}
			});
			resolve();
		});
	}

	private _on(client: Client, value: DiscordEventHandler): void {
		client.on(value.getEvent(), (...args) => {
			value.handleEvent(args);
		});
	}

	private _once(client: Client, value: DiscordEventHandler): void {
		client.once(value.getEvent(), (...args) => {
			value.handleEvent(args);
		});
	}

	private _off(client: Client, value: DiscordEventHandler): void {
		client.off(value.getEvent(), (...args) => {
			value.handleEvent(args);
		});
	}
}
