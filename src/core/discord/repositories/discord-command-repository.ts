import { oneLine } from "common-tags";
import { Collection, Message } from "discord.js";
import { Repository } from "../../classes/repository";
import { getInstancesFromFolder } from "../../functions/recursive-get-classes-dir";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordCommand } from "../classes/discord-command";
import { IDiscordCommandData } from "../interfaces/discord-command-data-interface";

export class DiscordCommandRepository extends Repository<DiscordCommand> {
	private _isBuilt = false;

	public async build(commandsPath: string): Promise<void> {
		if (this._isBuilt) throw new Error(`A Repository can only be built once !`);
		return getInstancesFromFolder<DiscordCommand>(commandsPath).then(
			discordCommands => {
				this._registerDiscordCommands(discordCommands);
				this._isBuilt = true;
			}
		);
	}

	private _cooldowns = new Collection<string, Collection<string, number>>();

	public commandCalled(command: DiscordCommand, message: Message): void {
		if (!this._cooldowns.has(command.name)) {
			this._cooldowns.set(command.name, new Collection());
		}
		const timestamps = this._cooldowns.get(command.name);
		if (timestamps) timestamps.set(message.author.id, Date.now());
	}

	public isCommandOnCooldown(
		command: DiscordCommand,
		message: Message
	): boolean {
		const timestamps = this._cooldowns.get(command.name);
		if (!timestamps) return false;

		const timestamp = timestamps.get(message.author.id);
		if (!timestamp) return false;

		const now = Date.now();
		const cooldownAmount = command.data.cooldown * 1000;
		const expirationTime = timestamp + cooldownAmount;
		return now < expirationTime;
	}

	public getCommand(callname: string): DiscordCommand | undefined {
		return this.all().find(value => {
			return value.callnames.includes(callname);
		});
	}

	public getCommandsData(): Readonly<IDiscordCommandData[]> {
		return this.all().map(command => {
			return command.data;
		});
	}

	private _registerDiscordCommands(discordCommands: DiscordCommand[]) {
		discordCommands.forEach(discordCommand => {
			this._registerDiscordCommand(discordCommand);
		});
	}

	private _registerDiscordCommand(discordCommand: DiscordCommand): void {
		const { callnames } = discordCommand;
		if (this._checkCallnamesAreAvailables(callnames)) {
			this.add(discordCommand);
			LoggerService.getInstance().info({
				context: discordCommand.constructor.name,
				message: oneLine`Registered command '${discordCommand.name}'
						with callnames [${callnames.join(`, `)}]`,
			});
		}
	}

	private _checkCallnamesAreAvailables(callnames: string[]): boolean {
		const commandUsingCallname = this._useTakenCallname(callnames);
		if (!commandUsingCallname) return true;
		const callname = commandUsingCallname.callnames.find(cname =>
			callnames.includes(cname)
		);
		throw new Error(
			oneLine`The registry already contains the command
				[${commandUsingCallname.name}] using the same callname '${callname}'`
		);
	}

	private _useTakenCallname(callnames: string[]): DiscordCommand | undefined {
		return this.all().find(value => {
			return value.callnames.some(callname => callnames.includes(callname));
		});
	}
}
