import { ClientEvents, Message } from "discord.js";
import { DiscordCommandHandler } from "../discord/classes/discord-command-handler";

export interface CustomEvents extends ClientEvents {
	unknownCommand: [Message];
	commandError: [DiscordCommandHandler, Message, Error];
}
