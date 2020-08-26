import { Client } from "discord.js";

export abstract class DiscordEventHandler {
	public abstract async assignEventsToClient(client: Client): Promise<void>;
}
