import { Message, User } from "discord.js";
import _ from "lodash";
import { CommandArgument } from "../core/discord/interfaces/discord-command-data-interface";
import { DiscordEmojis } from "../core/utils/constants";
import { DiscordUtils, mention } from "../core/discord/utils/discord-utils";
import { DiscordCommand } from "../core/discord/classes/discord-command";

export class DiscordVoteCommand extends DiscordCommand {
	constructor() {
		super(`vote`, {
			description: `Ask for a vote (yes/no only)`,
			guildOnly: true,
			cooldown: 5,
			arguments: [
				{
					name: `notify`,
					mandatory: true,
				},
			],
		});
	}

	protected async handleCommand(
		message: Message,
		...args: string[]
	): Promise<void> {
		const strawpoll = `${mention(
			message.author
		)} requested a vote : \n${args.join(` `)}`;
		let timeout = NaN;
		const notify = this.getArgument(`notify`);
		if (notify) {
			timeout = this._notifyArgumentIsValid(message, args);
			if (_.isNaN(timeout)) return;
		}
		this._vote(message, strawpoll, notify, timeout);
	}

	private _vote(
		message: Message,
		strawpoll: string,
		notify: CommandArgument | undefined,
		timeout: number
	) {
		message.channel.send(strawpoll).then(strawpollMessage => {
			if (notify) this._notify(message.author, strawpollMessage, timeout);
			message.delete().then(() => {
				DiscordUtils.reacts(
					strawpollMessage,
					DiscordEmojis.THUMBS_UP,
					DiscordEmojis.THUMBS_DOWN
				);
			});
		});
	}

	private async _notify(
		author: User,
		message: Message,
		timeout: number
	): Promise<void> {
		const link = DiscordUtils.getLinkTo(message);
		setTimeout(() => {
			message.channel.send(
				`${mention(
					author
				)} you were asked to be notified after ${timeout} seconds about : \n${link}`
			);
		}, timeout * 1000);
	}

	private _notifyArgumentIsValid(message: Message, args: string[]) {
		const index = args.indexOf(`--notify`);
		if (index + 1 >= args.length) {
			this._commandService._emit(
				`commandWrongArgumentUsage`,
				message,
				`The --notify argument should be followed by a number !`
			);
			return NaN;
		}
		const timeout = parseInt(args[index + 1], 10);
		if (_.isNaN(timeout)) {
			this._commandService._emit(
				`commandWrongArgumentUsage`,
				message,
				`The --notify argument should be followed by a number !`
			);
			return NaN;
		}
		return timeout;
	}
}
