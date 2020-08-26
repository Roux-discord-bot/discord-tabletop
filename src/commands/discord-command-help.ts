import { Message } from "discord.js";
import { DiscordCommandHandler } from "../core/discord/features/discord-command-handler";

export class DiscordCommandHelp extends DiscordCommandHandler {
	constructor() {
		super(`help`, {
			description: `Sends a pm about the available commands`,
			aliases: [`h`, `halp`, `aled`],
		});
	}

	public async handleCommand(message: Message): Promise<void> {
		const commandsData = this._commandService.getCommandsData();
		const commands = commandsData.map(commandData => {
			return `__${commandData.name}__ : ${commandData.description}\n\t**${
				this._commandService.prefix
			}${this._command}**, aliases : [${commandData.aliases.join(`, `)}]`;
		});
		await message.author.send(this._helpTemplate(commands));
	}

	private _helpTemplate(commands: string[]): string {
		return `**Availables commands**\n${commands.join(`\n`)}`;
	}
}
