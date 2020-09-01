import { ILoggerTypes } from "../../utils/logger/logger-interface";
import { IDiscordClientOptions } from "./discord-client-options-interface";

export interface IDiscordConfig {
	discordToken: string;
	prefix: string;
	root: string;
	eventsPath?: string;
	commandsPath?: string;
	langsPath?: string;
	locale?: string;
	client?: IDiscordClientOptions;
	logger?: ILoggerTypes;
}
