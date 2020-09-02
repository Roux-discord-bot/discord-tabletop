import { ClientEvents, Message } from "discord.js";
import { DiscordCommand } from "../discord/classes/discord-command";

export interface CustomEvents extends ClientEvents {
	unknownCommand: [Message];
	guildOnlyInDm: [Message, DiscordCommand];
	commandError: [DiscordCommand, Message, Error];
}
