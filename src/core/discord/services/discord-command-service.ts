import _ from "lodash";
import { Message } from "discord.js";
import { DiscordEventService } from "./discord-event-service";
import { DiscordCommandRepository } from "../repositories/discord-command-repository";
import { DiscordMessageEvent } from "../events/discord-message-event";
import { DiscordEventEmitterService } from "./discord-event-emitter-service";
import { DiscordCommand } from "../classes/discord-command";

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
		const command = this._repository.getCommand(callname);
		this._canBeExecuted(message, command).then(async condition => {
			if (condition && command) await command.executeCommand(message, args);
		});
	}

	private async _canBeExecuted(
		message: Message,
		command?: DiscordCommand
	): Promise<boolean> {
		if (!command) {
			await DiscordEventEmitterService.getInstance().emit(
				`unknownCommand`,
				message
			);
			return false;
		}
		if (this._isGuildOnlyCommandNotCalledInGuild(command, message)) {
			await DiscordEventEmitterService.getInstance().emit(
				`guildOnlyInDm`,
				message,
				command
			);
			return false;
		}
		if (this._repository.isCommandOnCooldown(command, message)) {
			await DiscordEventEmitterService.getInstance().emit(
				`commandInCooldown`,
				message,
				command
			);
			return false;
		}
		if (
			message.member &&
			!message.member.hasPermission(command.getData().permissions)
		) {
			await DiscordEventEmitterService.getInstance().emit(
				`commandNotAllowed`,
				message,
				command
			);
			return false;
		}

		return true;
	}

	private _isGuildOnlyCommandNotCalledInGuild(
		command: DiscordCommand,
		message: Message
	) {
		return command.isGuildOnly() && message.channel.type === `dm`;
	}

	private readonly _repository = new DiscordCommandRepository();

	public async init(commands: string): Promise<void> {
		await this._repository.build(commands);
		return DiscordEventService.getInstance()
			.getRepository()
			.registerEventHandler(new DiscordMessageEvent());
	}

	public getRepository(): DiscordCommandRepository {
		return this._repository;
	}
}
