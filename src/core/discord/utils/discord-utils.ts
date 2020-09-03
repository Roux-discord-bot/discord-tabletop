import {
	Base,
	Channel,
	EmojiResolvable,
	Message,
	Role,
	User,
} from "discord.js";

export class DiscordUtils {
	constructor() {
		throw new Error(`${this.constructor.name} should not be instanciated`);
	}

	static async reacts(
		message: Message,
		...emojis: EmojiResolvable[]
	): Promise<Message> {
		return Promise.all(emojis.map(emoji => message.react(emoji))).then(
			() => message
		);
	}
}

export function mention(source?: Channel): string;

export function mention(source?: User): string;

export function mention(source?: Role): string;

export function mention(source?: Base): string {
	if (source === undefined) return ``;
	if (source instanceof User) return `<@${source.id}>`;
	if (source instanceof Role) return `<@&${source.id}>`;
	if (source instanceof Channel) return `<#${source.id}>`;
	return ``;
}
