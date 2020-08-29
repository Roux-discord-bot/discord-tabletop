import _ from "lodash";
import { Message } from "discord.js";
import { DiscordEventService } from "./discord-event-service";
import { DiscordCommandRepository } from "../repositories/discord-command-repository";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import { DiscordMessageEvent } from "../classes/discord-message-event";
import { DiscordEventEmitterService } from "./discord-event-emitter-service";

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
		if (!commandHandler) {
			DiscordEventEmitterService.getInstance().emit(`unknownCommand`, message);
		} else {
			await commandHandler.handleCommand(message, args);
		}
	}

	private readonly _repository = new DiscordCommandRepository();

	public async init({ commands }: IDiscordConfig): Promise<void> {
		await this._repository.build(commands);
		return DiscordEventService.getInstance()
			.getRepository()
			.registerEventHandler(new DiscordMessageEvent());
	}

	public getRepository(): DiscordCommandRepository {
		return this._repository;
	}
}
