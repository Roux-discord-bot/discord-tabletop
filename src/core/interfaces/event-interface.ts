import { ClientEvents, Message } from "discord.js";

export interface CustomEvents extends ClientEvents {
	unknownCommand: [Message];
}
