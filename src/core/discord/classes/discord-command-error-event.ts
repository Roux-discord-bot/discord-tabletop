import { Message, User } from "discord.js";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordEvent } from "./discord-event";
import { DiscordClient } from "./discord-client";
import { DiscordClientService } from "../services/discord-client-service";
import { DiscordCommand } from "./discord-command";
import { DiscordEmbed } from "../embeds/discord-embed";

export class DiscordCommandErrorEvent extends DiscordEvent {
	public async assignEventsToClient(client: DiscordClient): Promise<void> {
		client.on(`commandError`, async (commandHandler, message, error) => {
			LoggerService.getInstance().error({
				context: `Event - CommandError`,
				message: `The command '${commandHandler.getName()}' within the message : "${message}" returned an error :\n${
					error.stack ? error.stack : error
				}`,
			});
			const owner = await this._fetchOwner(client);
			this._sendOwner(owner, commandHandler, message, error);
			this._sendChannel(message, commandHandler, owner);
		});
	}

	private async _fetchOwner(client: DiscordClient) {
		const ownerId = DiscordClientService.getInstance()
			.getClient()
			.getOption(`owner`);
		const owner = await client.users.fetch(
			ownerId || `Please specify an owner to handle the commandError case`
		);
		return owner;
	}

	private _sendChannel(
		message: Message,
		commandHandler: DiscordCommand,
		owner: User
	) {
		message.channel.send(
			this._makeChannelEmbedError(
				commandHandler.getCommand(),
				owner ? owner.id : undefined
			)
		);
	}

	private _sendOwner(
		owner: User,
		commandHandler: DiscordCommand,
		message: Message,
		error: Error
	) {
		if (owner) {
			owner.send(
				this._makeOwnerEmbedError(
					commandHandler.getCommand(),
					message.content,
					error
				)
			);
		}
	}

	public _makeChannelEmbedError(
		command: string,
		ownerId?: string
	): DiscordEmbed {
		const embed = new DiscordEmbed();
		embed
			.setColor(`RED`)
			.setTitle(`Command error !`)
			.setDescription(`An error on the command ${command} occured.`);
		if (ownerId) embed.addField(`Seek help ?`, `You can ask <@${ownerId}> !`);

		return embed;
	}

	public _makeOwnerEmbedError(
		command: string,
		message: string,
		error?: Error
	): DiscordEmbed {
		const embed = new DiscordEmbed();
		embed
			.setColor(`RED`)
			.setTitle(`Command Error !`)
			.setDescription(`An error on a command occured, see details below`)
			.addField(`Command`, command)
			.addField(`Message content`, message);

		if (error) {
			embed.addField(`Reason :`, `${error.message}`);
			if (error.stack) {
				embed.addField(`Error stack trace :`, `\`\`\`${error.stack}\`\`\``);
			}
		}

		return embed;
	}
}
