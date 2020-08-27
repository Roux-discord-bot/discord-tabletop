import _ from "lodash";
import { Client, Message } from "discord.js";
import { DiscordEventService } from "./discord-event-service";
import { DiscordEventHandler } from "../features/discord-event-handler";
import { DiscordCommandRepository } from "../repositories/discord-command-repository";
import { IDiscordConfig } from "../interfaces/discord-config-interface";

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
		const callname = args.shift()?.toLowerCase();
		if (!callname) return;
		await this.discordCommandService.call(message, callname, ...args);
	}
}

export class DiscordCommandService {
	private static _instance: DiscordCommandService;

	public static getInstance(): DiscordCommandService {
		if (_.isNil(DiscordCommandService._instance))
			DiscordCommandService._instance = new DiscordCommandService();

		return DiscordCommandService._instance;
	}

	private _prefix = ``;

	public get prefix(): string {
		return this._prefix;
	}

	public async call(
		message: Message,
		callname: string,
		...args: string[]
	): Promise<void> {
		const commandHandler = this._repository.getCommand(callname);
		if (!commandHandler)
			throw new Error(`Command '${callname}' cannot be found !`);
		await commandHandler.handleCommand(message, args);
	}

	private readonly _repository = new DiscordCommandRepository();

	public async init({ prefix, commands }: IDiscordConfig): Promise<void> {
		this._prefix = prefix;
		await this._repository.build(commands);
		DiscordEventService.getInstance()
			.getRepository()
			.registerEventHandler(new DiscordOnMessageEvent(this));
	}

	public getRepository(): DiscordCommandRepository {
		return this._repository;
	}
}
