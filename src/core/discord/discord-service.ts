/* eslint-disable class-methods-use-this */
import _ from "lodash";
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
		return Promise.resolve() // Just to keep each init lined up
			.then(() => langs.init(config))
			.then(() => DiscordConfigService.getInstance().init(config))
			.then(() => LoggerService.getInstance().init(config))
			.then(() => DiscordClientService.getInstance().init(config))
			.then(() => DiscordEventService.getInstance().init(config))
			.then(() => DiscordCommandService.getInstance().init(config))
			.then(() => DiscordAuthenticationService.getInstance().init(config))
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
