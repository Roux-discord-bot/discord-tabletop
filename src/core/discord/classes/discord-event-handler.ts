import { DiscordClient } from "./discord-client";

export abstract class DiscordEventHandler {
	public abstract async assignEventsToClient(
		client: DiscordClient
	): Promise<void>;
}
