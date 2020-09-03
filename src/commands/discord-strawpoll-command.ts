import { Message } from "discord.js";
import { DiscordUtils, mention } from "../core/discord/utils/discord-utils";
import { DiscordCommand } from "../core/discord/classes/discord-command";

export class DiscordStrawpollCommand extends DiscordCommand {
	constructor() {
		super(`strawpoll`, {
			aliases: [`poll`, `vote`],
			description: `Generate a strawpoll`,
			guildOnly: true,
			cooldown: 5,
		});
	}

	protected async handleCommand(
		message: Message,
		...args: string[]
	): Promise<void> {
		const strawpoll = `${mention(
			message.author
		)} requested a Strawpoll : \n${args.join(` `)}`;
		message.channel.send(strawpoll).then(strawpollMessage => {
			message.delete().then(() => {
				DiscordUtils.reacts(strawpollMessage, `👍`, `👎`);
			});
		});
	}
}
