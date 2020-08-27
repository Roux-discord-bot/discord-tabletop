import _ from "lodash";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordClientService } from "./discord-client-service";
import { IDiscordConfig } from "../interfaces/discord-config-interface";

export class DiscordAuthenticationService {
	private static _instance: DiscordAuthenticationService;

	private _authenticated = false;

	public static getInstance(): DiscordAuthenticationService {
		if (_.isNil(DiscordAuthenticationService._instance))
			DiscordAuthenticationService._instance = new DiscordAuthenticationService();
		return DiscordAuthenticationService._instance;
	}

	public async init({ discordToken }: IDiscordConfig): Promise<void> {
		return this.login(discordToken);
	}

	public async login(token: string): Promise<void> {
		LoggerService.getInstance().info({
			context: `DiscordAuthenticationService`,
			message: `The bot is logging in . . .`,
		});
		return DiscordClientService.getInstance()
			.getClient()
			.login(token)
			.then(() => {
				this._authenticated = true;
			})
			.catch(err => {
				LoggerService.getInstance().error({
					context: `DiscordAuthenticationService`,
					message: `The bot could not log in, reason : ${err}`,
				});
				return Promise.reject(new Error(err));
			});
	}

	public isAuthenticated(): boolean {
		return this._authenticated;
	}
}
