/* eslint-disable class-methods-use-this */
import _ from "lodash";
import { LoggerService } from "../../utils/logger/logger-service";
import { IDiscordConfig } from "./interfaces/discord-config-interface";
import { DiscordAuthenticationService } from "./services/discord-authentication-service";
import { DiscordEventService } from "./services/discord-event-service";

export class DiscordService {
	private static _instance: DiscordService;

	public static getInstance(): DiscordService {
		if (_.isNil(DiscordService._instance))
			DiscordService._instance = new DiscordService();

		return DiscordService._instance;
	}

	public async start(config: IDiscordConfig): Promise<void> {
		return Promise.all([
			DiscordEventService.getInstance().init(config.events),
			DiscordAuthenticationService.getInstance().init(),
		])
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

				return Promise.reject(new Error(error));
			});
	}
}
