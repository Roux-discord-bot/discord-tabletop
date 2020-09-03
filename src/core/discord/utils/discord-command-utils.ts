import { EmojiResolvable, Message } from "discord.js";

export class DiscordCommandUtils {
	constructor() {
		throw new Error(`${this.constructor.name} should not be instanciated`);
	}

	static async reactOrdered(
		message: Message,
		...emojis: EmojiResolvable[]
	): Promise<Message> {
		const first = emojis.shift();
		if (!first) return message;
		const promise = message.react(first);
		return promise.then(() =>
			DiscordCommandUtils.reactOrdered(message, ...emojis)
		);
	}

	static async reactUnordered(
		message: Message,
		...emojis: EmojiResolvable[]
	): Promise<Message> {
		return Promise.all(emojis.map(emoji => message.react(emoji))).then(
			() => message
		);
	}
}
