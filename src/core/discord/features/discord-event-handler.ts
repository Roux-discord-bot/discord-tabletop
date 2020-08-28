import { DiscordClient } from "../classes/discord-client";

export abstract class DiscordEventHandler {
	public abstract async assignEventsToClient(
		client: DiscordClient
	): Promise<void>;
}
