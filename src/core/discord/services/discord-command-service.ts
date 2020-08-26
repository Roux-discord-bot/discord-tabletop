import _ from "lodash";
import { Constructable, Message } from "discord.js";
import { oneLine } from "common-tags";
import { LoggerService } from "../../utils/logger/logger-service";
import { recursiveReadDir } from "../../functions/recursive-read-dir";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import {
	DiscordCommandData,
	DiscordCommandHandler,
} from "../features/discord-command-handler";
import { DiscordEventService } from "./discord-event-service";

export class DiscordCommandService {
	private static _instance: DiscordCommandService;

	public static getInstance(): DiscordCommandService {
		if (_.isNil(DiscordCommandService._instance))
			DiscordCommandService._instance = new DiscordCommandService();

		return DiscordCommandService._instance;
	}

	private _commandByCallname = new Map<string, DiscordCommandHandler>();

	public getCommandsData(): Readonly<DiscordCommandData[]> {
		const result: DiscordCommandData[] = [];
		this._commandByCallname.forEach(commandHandler => {
			const data = commandHandler.getData();
			if (!result.includes(data)) result.push(data);
		});
		return result;
	}

	private async _call(
		message: Message,
		command: string,
		...args: string[]
	): Promise<void> {
		const commandHandler = this._commandByCallname.get(command);
		if (!commandHandler)
			throw new Error(`Command '${command}' cannot be found !`);
		await commandHandler.handleCommand(message, args);
	}

	private async _retrieveCommandHandlers(
		eventsPath: string
	): Promise<DiscordCommandHandler[]> {
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
	): Promise<DiscordCommandHandler[]> {
		return import(filePath)
			.then(file => {
				return this._instantiateGivenClasses(file).filter(clazz => {
					return clazz instanceof DiscordCommandHandler;
				});
			})
			.catch(err => {
				LoggerService.getInstance().error({
					context: `DiscordCommandService`,
					message: `Error retrieving all the command handlers, reason : \n${err}`,
				});
				return Promise.reject(new Error(err));
			});
	}

	private _instantiateGivenClasses(classes: {
		[key: string]: Constructable<DiscordCommandHandler>;
	}): DiscordCommandHandler[] {
		return Object.keys(classes).map(cname => {
			return new classes[cname]();
		});
	}

	private _prefix = ``;

	public get prefix(): string {
		return this._prefix;
	}

	public async init({ prefix, commands }: IDiscordConfig): Promise<void> {
		this._prefix = prefix;
		const commandHandlers = await this._retrieveCommandHandlers(commands);
		await this._registerEachCommandHandlerInRegistry(commandHandlers);
		DiscordEventService.getInstance().registerEventHandler({
			assignEventsToClient: async client => {
				client.on(`message`, async message => {
					await this._onMessage(message);
				});
			},
		});
	}

	private async _onMessage(message: Message): Promise<void> {
		if (!message.content.startsWith(this._prefix) || message.author.bot) return;
		const args = message.content.slice(this._prefix.length).trim().split(/ +/g);
		const command = args.shift()?.toLowerCase();
		if (!command) return;
		await this._call(message, command, ...args);
	}

	private async _registerEachCommandHandlerInRegistry(
		commandHandlers: DiscordCommandHandler[]
	): Promise<void> {
		commandHandlers.forEach(commandHandler => {
			this._registerCommandInRegistry(commandHandler);
		});
	}

	private _registerCommandInRegistry(commandHandler: DiscordCommandHandler) {
		const callnames = this._getCommandCallnames(commandHandler);
		callnames.forEach(callname => {
			this._registerCommandInRegistryForCallname(callname, commandHandler);
		});
		LoggerService.getInstance().info({
			context: commandHandler.constructor.name,
			message: oneLine`Registered command '${commandHandler.getName()}'
					with callnames [${callnames.join(`, `)}]`,
		});
	}

	private _registerCommandInRegistryForCallname(
		callname: string,
		commandHandler: DiscordCommandHandler
	): void {
		const assignedCommand = this._commandByCallname.get(callname);
		if (assignedCommand) {
			throw new Error(oneLine`
				The registry already contains the command [${assignedCommand.getName()}]
				using the same callname '${callname}'`);
		} else {
			this._commandByCallname.set(callname, commandHandler);
		}
	}

	private _getCommandCallnames(
		commandHandler: DiscordCommandHandler
	): string[] {
		const callnames = Object.assign([], commandHandler.getData().aliases);
		callnames.push(commandHandler.getCommand());
		return callnames;
	}
}
