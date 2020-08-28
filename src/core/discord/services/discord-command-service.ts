import _ from "lodash";
import { Message } from "discord.js";
import { DiscordEventService } from "./discord-event-service";
import { DiscordEventHandler } from "../features/discord-event-handler";
import { DiscordCommandRepository } from "../repositories/discord-command-repository";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import { DiscordConfigService } from "./discord-config-service";
import { DiscordClient } from "../classes/discord-client";

class DiscordOnMessageEvent extends DiscordEventHandler {
	public async assignEventsToClient(client: DiscordClient): Promise<void> {
		client.on(`message`, async message => {
			await this._onMessage(message);
		});
	}

	private async _onMessage(message: Message): Promise<void> {
		const prefix = DiscordConfigService.getInstance().get(`prefix`);
		if (!message.content.startsWith(prefix) || message.author.bot) return;
		const args = message.content.slice(prefix.length).trim().split(/ +/g);
		const callname = args.shift()?.toLowerCase();
		if (!callname) return;
		// eslint-disable-next-line no-use-before-define
		await DiscordCommandService.getInstance().call(message, callname, ...args);
	}
}

export class DiscordCommandService {
	private static _instance: DiscordCommandService;

	public static getInstance(): DiscordCommandService {
		if (_.isNil(DiscordCommandService._instance))
			DiscordCommandService._instance = new DiscordCommandService();

		return DiscordCommandService._instance;
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

	public async init({ commands }: IDiscordConfig): Promise<void> {
		await this._repository.build(commands);
		return DiscordEventService.getInstance()
			.getRepository()
			.registerEventHandler(new DiscordOnMessageEvent());
	}

	public getRepository(): DiscordCommandRepository {
		return this._repository;
	}
}
