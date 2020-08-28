import { ClientEvents, Message } from "discord.js";

export type CustomEvents = ClientEvents & {
	unknownCommand: [Message];
};
