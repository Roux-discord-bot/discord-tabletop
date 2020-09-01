import { ILoggerTypes } from "../../utils/logger/logger-interface";
import { IDiscordClientOptions } from "./discord-client-options-interface";

export interface IDiscordConfig {
	discordToken: string;
	events: string;
	prefix: string;
	commands: string;
	langs: string;
	locale?: string;
	client?: IDiscordClientOptions;
	logger?: ILoggerTypes;
}
