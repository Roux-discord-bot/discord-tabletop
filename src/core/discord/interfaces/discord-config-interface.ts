import { ILoggerConfig } from "src/core/utils/logger/logger-service";

export interface IDiscordConfig extends ILoggerConfig {
	discordToken: string;
	events: string;
	prefix: string;
	commands: string;
}
