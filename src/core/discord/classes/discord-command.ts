import { Message } from "discord.js";
import { IDiscordCommandData } from "../interfaces/discord-command-data-interface";
import { DiscordCommandService } from "../services/discord-command-service";

type DiscordCommandData = IDiscordCommandData & { command: string };

export abstract class DiscordCommand {
	protected readonly _commandService: DiscordCommandService;

	public readonly data: Readonly<DiscordCommandData>;

	constructor(command: string, options: Partial<IDiscordCommandData>) {
		this._commandService = DiscordCommandService.INSTANCE;
		this.data = {
			name: command[0].toUpperCase() + command.slice(1),
			command,
			description: ``,
			aliases: [],
			guildOnly: false,
			cooldown: 1,
			permissions: [],
			...options,
		};
	}

	public isGuildOnly(): boolean {
		return this.data.guildOnly;
	}

	public get name(): string {
		return this.data.name;
	}

	public get command(): string {
		return this.data.command;
	}

	public get callnames(): string[] {
		return Array<string>(this.command, ...this.data.aliases);
	}

	public async executeCommand(
		message: Message,
		...args: string[]
	): Promise<void> {
		await this.handleCommand(message, ...args);
		this._commandService.repository.commandCalled(this, message);
	}

	protected abstract async handleCommand(
		message: Message,
		...args: string[]
	): Promise<void>;
}
