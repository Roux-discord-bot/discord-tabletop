import { Client } from "discord.js";
import { CustomEvents } from "../../interfaces/event-constants";

export class DiscordClient extends Client {
	public on<K extends keyof CustomEvents>(
		event: K,
		listener: (...args: CustomEvents[K]) => void
	): this;

	public on<S extends string | symbol>(
		event: Exclude<S, keyof CustomEvents>,
		listener: (...args: unknown[]) => void
	): this;

	public on(event: string, listener: (...args: unknown[]) => void): this {
		super.on(event, listener);
		return this;
	}
}
