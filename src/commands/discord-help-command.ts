import { EmbedFieldData, Message } from "discord.js";
import { DiscordEmbed } from "../core/discord/embeds/discord-embed";
import { DiscordCommandHandler } from "../core/discord/classes/discord-command-handler";

export class DiscordHelpCommand extends DiscordCommandHandler {
	constructor() {
		super(`help`, {
			description: `Sends a pm about all the available commands`,
			aliases: [`h`, `halp`, `aled`],
		});
	}

	public async handleCommand(message: Message): Promise<void> {
		const embed = new DiscordEmbed()
			.setTitle(`Available commands`)
			.setDescription(`Show all the available commands`);

		const fields: EmbedFieldData[] = this._mapperCommandsToFields();
		if (fields && fields.length > 0) embed.addFields(...fields);

		await message.author.send(embed);
	}

	private _mapperCommandsToFields() {
		return this._commandService
			.getRepository()
			.all()
			.map(command => {
				return this._mapperCommandToFieldData(command);
			});
	}

	private _mapperCommandToFieldData(
		command: DiscordCommandHandler
	): EmbedFieldData {
		return {
			name: `${command.getName()}`,
			value: [
				`${command.getData().description}`,
				`[${command.getCallnames().join(`, `)}]`,
			],
		};
	}
}
