import _ from "lodash";
import { Client, Message } from "discord.js";
import { oneLine } from "common-tags";
import { LoggerService } from "../../utils/logger/logger-service";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import {
	DiscordCommandData,
	DiscordCommandHandler,
} from "../features/discord-command-handler";
import { DiscordEventService } from "./discord-event-service";
import { getInstancesFromFolder } from "../../functions/recursive-get-classes-dir";
import { DiscordEventHandler } from "../features/discord-event-handler";

class DiscordOnMessageEvent extends DiscordEventHandler {
	private discordCommandService: DiscordCommandService;

	constructor(discordEventService: DiscordCommandService) {
		super();
		this.discordCommandService = discordEventService;
	}

	public async assignEventsToClient(client: Client): Promise<void> {
		client.on(`message`, async message => {
			await this._onMessage(message);
		});
	}

	private async _onMessage(message: Message): Promise<void> {
		const { prefix } = this.discordCommandService;
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const command = args.shift()?.toLowerCase();
		if (!command) return;
		await this.discordCommandService.call(message, command, ...args);
	}
}

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

	private _prefix = ``;

	public get prefix(): string {
		return this._prefix;
	}

	public async call(
		message: Message,
		command: string,
		...args: string[]
	): Promise<void> {
		const commandHandler = this._commandByCallname.get(command);
		if (!commandHandler)
			throw new Error(`Command '${command}' cannot be found !`);
		await commandHandler.handleCommand(message, args);
	}

	public async init({ prefix, commands }: IDiscordConfig): Promise<void> {
		this._prefix = prefix;
		const commandHandlers = await getInstancesFromFolder<DiscordCommandHandler>(
			commands
		);
		await this._registerEachCommandHandlerInRegistry(commandHandlers);
		DiscordEventService.getInstance().registerEventHandler(
			new DiscordOnMessageEvent(this)
		);
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
