import { Message } from "discord.js";
import { DiscordCommand } from "../core/discord/classes/discord-command";

export class DiscordCooldownTestCommand extends DiscordCommand {
	constructor() {
		super(`roll`, {
			aliases: [`dice`],
			description: `Roll a dice, by default between 1-6 but range can be specified`,
			cooldown: 3,
		});
	}

	protected async handleCommand(message: Message): Promise<void> {
		await message.channel.send(`You cannot use this command for another 10s !`);
	}
}
