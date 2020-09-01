/* eslint-disable class-methods-use-this */
import _ from "lodash";
import path from "path";
import langs from "../utils/langs";
import { LoggerService } from "../utils/logger/logger-service";
import { IDiscordConfig } from "./interfaces/discord-config-interface";
import { DiscordAuthenticationService } from "./services/discord-authentication-service";
import { DiscordClientService } from "./services/discord-client-service";
import { DiscordCommandService } from "./services/discord-command-service";
import { DiscordConfigService } from "./services/discord-config-service";
import { DiscordEventService } from "./services/discord-event-service";

export class DiscordService {
	private static _instance: DiscordService;

	public static getInstance(): DiscordService {
		if (_.isNil(DiscordService._instance))
			DiscordService._instance = new DiscordService();

		return DiscordService._instance;
	}

	public async start(config: IDiscordConfig): Promise<void> {
		const {
			discordToken,
			root,
			client,
			commandsPath = config.commandsPath || path.join(root, `commands`),
			eventsPath = config.eventsPath || path.join(root, `events`),
			langsPath = config.eventsPath || path.join(root, `langs`),
			locale,
			logger,
		} = config;

		return Promise.resolve() // Just to keep each init lined up
			.then(() => DiscordConfigService.getInstance().init(config))
			.then(() => langs.init(langsPath, locale))
			.then(() => LoggerService.getInstance().init(logger))
			.then(() => DiscordClientService.getInstance().init(client))
			.then(() => DiscordEventService.getInstance().init(eventsPath))
			.then(() => DiscordCommandService.getInstance().init(commandsPath))
			.then(() => DiscordAuthenticationService.getInstance().init(discordToken))
			.then(() => {
				LoggerService.getInstance().success({
					context: `DiscordService`,
					message: `All the services started properly.`,
				});
			})
			.catch(error => {
				LoggerService.getInstance().error({
					context: `DiscordService`,
					message: `At least one service couldn't start, reason : ${error}`,
				});

				return Promise.reject(
					error instanceof Error ? error : new Error(error)
				);
			});
	}
}
