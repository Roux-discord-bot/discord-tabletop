import { Message } from "discord.js";
import { DiscordCommandUtils } from "../core/discord/utils/discord-command-utils";
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
		const strawpoll = `<@${
			message.author.id
		}> authored a strawpoll : \n${args.join(` `)}`;
		message.channel.send(strawpoll).then(sentMessage => {
			message.delete().then(() => {
				DiscordCommandUtils.reactUnordered(sentMessage, `👍`, `👎`, `😀`);
			});
		});
	}
}
