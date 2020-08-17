import _ from "lodash";
import { oneLine } from "common-tags";
import logger from "../../../utils/logger";
import DiscordConfigService from "./discord-config-service";
import DiscordClientService from "./discord-client-service";

export default class DiscordAuthenticationService {
	private static _instance: DiscordAuthenticationService;

	private _authenticated = false;

	public static getInstance(): DiscordAuthenticationService {
		if (_.isNil(DiscordAuthenticationService._instance))
			DiscordAuthenticationService._instance = new DiscordAuthenticationService();
		return DiscordAuthenticationService._instance;
	}

	public async login(): Promise<unknown> {
		const discordConfigService = DiscordConfigService.getInstance();
		return DiscordClientService.getInstance()
			.getClient()
			.login(discordConfigService.getDiscordToken())
			.then(() => {
				this._authenticated = true;
				logger.log(
					oneLine`The bot is logging in, using : 
					${discordConfigService.getSafeToPrintDiscordToken()}`
				);
			})
			.catch(err => {
				logger.error(`The bot could not log in, reason : ${err}`);
			});
	}

	public isAuthenticated(): boolean {
		return this._authenticated;
	}
}
