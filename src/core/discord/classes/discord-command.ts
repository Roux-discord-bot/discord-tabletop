import { Message } from "discord.js";
import { IDiscordCommandData } from "../interfaces/discord-command-data-interface";
import { DiscordCommandService } from "../services/discord-command-service";

export abstract class DiscordCommand {
	protected readonly _commandService: DiscordCommandService;

	protected readonly _command: string;

	protected readonly _data: Readonly<IDiscordCommandData>;

	constructor(command: string, options: Partial<IDiscordCommandData>) {
		this._commandService = DiscordCommandService.getInstance();
		this._command = command;
		this._data = {
			name: command[0].toUpperCase() + command.slice(1),
			description: ``,
			aliases: [],
			guildOnly: false,
			...options,
		};
	}

	public isGuildOnly(): boolean {
		return this._data.guildOnly;
	}

	public getName(): string {
		return this._data.name;
	}

	public getCommand(): string {
		return this._command;
	}

	public getCallnames(): string[] {
		return Array<string>(this.getCommand(), ...this.getData().aliases);
	}

	public getData(): IDiscordCommandData {
		return this._data;
	}

	public abstract async handleCommand(
		message: Message,
		args: string[]
	): Promise<void>;
}
