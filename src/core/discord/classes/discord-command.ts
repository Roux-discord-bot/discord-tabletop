import { Message } from "discord.js";
import { Utils } from "../../utils/utils";
import {
	CommandArgument,
	IDiscordCommandData,
} from "../interfaces/discord-command-data-interface";
import { DiscordCommandService } from "../services/discord-command-service";

type DiscordCommandData = IDiscordCommandData & { command: string };

export abstract class DiscordCommand {
	protected readonly _commandService: DiscordCommandService;

	private readonly _collectedArguments: CommandArgument[] = [];

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
			arguments: [],
			...options,
		};
	}

	public async executeCommand(
		message: Message,
		...args: string[]
	): Promise<void> {
		if (this._lackMandatoryArgument(args, message)) return;

		args
			.filter(arg => arg.startsWith(`--`))
			.map(arg => arg.slice(2)) // Remove the '--'
			.filter(arg => this.data.arguments.map(cmd => cmd.name).includes(arg))
			.forEach(arg => this._collectArgument(arg));
		await this.handleCommand(message, ...args);
		this._commandService.repository.commandCalled(this, message);
	}

	/**
	 *
	 * @param argument The argument to find and use as a starting point
	 * @param args The array to remove elements from
	 * @param supplementaryElements
	 * If you need more than the given argument to be removed
	 */
	protected removeArgument(
		argument: string,
		args: string[],
		supplementaryElements?: number
	): string[] {
		const index = args.indexOf(argument);
		if (index === -1) return args;
		return Utils.removeElementsFromArray(args, index, supplementaryElements);
	}

	protected abstract async handleCommand(
		message: Message,
		...args: string[]
	): Promise<void>;

	public hasArgument(name: string): boolean {
		return this.getArgument(name) !== undefined;
	}

	public getArgument(name: string): CommandArgument | undefined {
		return this._collectedArguments.find(argument => argument.name === name);
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

	private _collectArgument(name: string) {
		if (this.hasArgument(name)) return;

		const argument = this.data.arguments.find(arg => arg.name === name);
		if (argument) this._collectedArguments.push(argument);
	}

	private _lackMandatoryArgument(args: string[], message: Message) {
		const missingMandatoryArgument = this._getUnfullfiledMandatoryArgument(
			...args
		);
		if (missingMandatoryArgument !== undefined) {
			this._commandService._emit(
				`commandMandatoryArgumentMissing`,
				message,
				missingMandatoryArgument,
				this
			);
			return true;
		}
		return false;
	}

	private _getUnfullfiledMandatoryArgument(
		...args: string[]
	): CommandArgument | undefined {
		return this.data.arguments
			.filter(argument => {
				return argument.mandatory === true;
			})
			.find(argument => !args.includes(`--${argument.name}`));
	}
}
