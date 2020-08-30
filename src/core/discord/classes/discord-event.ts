import { DiscordClient } from "./discord-client";

export abstract class DiscordEvent {
	public abstract async assignEventsToClient(
		client: DiscordClient
	): Promise<void>;
}
