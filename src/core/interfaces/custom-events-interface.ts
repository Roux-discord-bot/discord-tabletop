import { ClientEvents, Message } from "discord.js";
import { DiscordCommand } from "../discord/classes/discord-command";

export interface CustomEvents extends ClientEvents {
	unknownCommand: [Message];
	commandError: [DiscordCommand, Message, Error];
}
