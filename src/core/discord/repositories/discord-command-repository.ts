import { oneLine } from "common-tags";
import { Repository } from "../../classes/repository";
import { getInstancesFromFolder } from "../../functions/recursive-get-classes-dir";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordCommandData, DiscordCommand } from "../classes/discord-command";

export class DiscordCommandRepository extends Repository<DiscordCommand> {
	private _isBuilt = false;

	public async build(commandsPath: string): Promise<void> {
		if (this._isBuilt) throw new Error(`A Repository can only be built once !`);
		const commandHandlers = await getInstancesFromFolder<DiscordCommand>(
			commandsPath
		);
		this._registerCommandHandlers(commandHandlers);
		this._isBuilt = true;
	}

	public getCommand(callname: string): DiscordCommand | undefined {
		return this.all().find(value => {
			return value.getCallnames().includes(callname);
		});
	}

	public getCommandsData(): Readonly<DiscordCommandData[]> {
		return this.all().map(command => {
			return command.getData();
		});
	}

	private _registerCommandHandlers(commandHandlers: DiscordCommand[]) {
		commandHandlers.forEach(commandHandler => {
			this._registerCommand(commandHandler);
		});
	}

	private _registerCommand(commandHandler: DiscordCommand): void {
		const callnames = commandHandler.getCallnames();
		this._checkCallnamesAreAvailables(callnames);
		this.add(commandHandler);
		LoggerService.getInstance().info({
			context: commandHandler.constructor.name,
			message: oneLine`Registered command '${commandHandler.getName()}'
					with callnames [${callnames.join(`, `)}]`,
		});
	}

	private _checkCallnamesAreAvailables(callnames: string[]): void {
		const assigned = this._useTakenCallname(callnames);
		if (!assigned) return;
		const callname = assigned
			.getCallnames()
			.find(cname => callnames.includes(cname));
		if (assigned)
			throw new Error(
				oneLine`The registry already contains the command
				[${assigned.getName()}] using the same callname '${callname}'`
			);
	}

	private _useTakenCallname(callnames: string[]): DiscordCommand | undefined {
		return this.all().find(value => {
			return value
				.getCallnames()
				.some(callname => callnames.includes(callname));
		});
	}
}
