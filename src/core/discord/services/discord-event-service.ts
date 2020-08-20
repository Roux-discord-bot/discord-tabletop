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

	private eventHandlers: Array<DiscordEventHandler>;

	constructor() {
		this.eventHandlers = [];
	}

	public addEventHandler(eventHandler: DiscordEventHandler): void {
		this.eventHandlers.push(eventHandler);
	}

	public async fillEventHandlers(eventsPath: string): Promise<void> {
		return recursiveReadDir(eventsPath).then(files => {
			files.forEach(filePath => {
				return this._importClassesFromPath(filePath);
			});
		});
	}

	private _importClassesFromPath(filePath: string) {
		import(filePath)
			.then(clazz => {
				this._addAllClassesInFileToEventHandlers(clazz);
			})
			.catch(err => {
				LoggerService.getInstance().error({
					context: `DiscordEventService`,
					message: `Error retreiving all the event handlers, reason : \n${err}`,
				});
				return Promise.reject(new Error(err));
			});
	}

	private _addAllClassesInFileToEventHandlers(clazz: {
		[key: string]: Constructable<DiscordEventHandler>;
	}) {
		Object.keys(clazz).forEach(key => {
			const eventHandler = new clazz[key]();
			this.addEventHandler(eventHandler);
		});
	}

	public async init(eventsPath: string): Promise<void> {
		await this.fillEventHandlers(eventsPath);
		return new Promise((resolve, reject) => {
			const client = DiscordClientService.getInstance().getClient();
			this.eventHandlers.forEach(value => {
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
