import { ClientOptions } from "discord.js";
import { ILoggerTypes } from "src/core/utils/logger/logger-interface";

export interface IDiscordConfig {
	discordToken: string;
	events: string;
	prefix: string;
	commands: string;
	client?: ClientOptions;
	logger?: ILoggerTypes;
}
