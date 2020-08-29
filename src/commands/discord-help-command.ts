import { EmbedFieldData, Message, MessageEmbed } from "discord.js";
import { DiscordCommandHandler } from "../core/discord/classes/discord-command-handler";

export class DiscordHelpCommand extends DiscordCommandHandler {
	constructor() {
		super(`help`, {
			description: `Sends a pm about all the available commands`,
			aliases: [`h`, `halp`, `aled`],
		});
	}

	public async handleCommand(message: Message): Promise<void> {
		const embed = new MessageEmbed()
			.setColor(`#00BFFF`)
			.setTitle(`Available commands`)
			.setAuthor(`Roux`, `https://i.imgur.com/NNKJUkI.png`)
			.setDescription(`Show all the available commands`);

		const fields = this._commandService
			.getRepository()
			.all()
			.map(
				(command): EmbedFieldData => {
					return {
						name: `${command.getName()}`,
						value: [
							`${command.getData().description}`,
							`[${command.getCallnames().join(`, `)}]`,
						],
					};
				}
			);
		if (fields && fields.length > 0) embed.addFields(fields);

		await message.author.send(embed);
	}
}
