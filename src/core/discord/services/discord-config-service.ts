import _ from "lodash";
import { IDiscordConfig } from "../interfaces/discord-config-interface";

export class DiscordConfigService implements IDiscordConfig {
	private static _instance: DiscordConfigService;

	public MISSING_TOKEN = `MISSING_TOKEN`;

	public static getInstance(): DiscordConfigService {
		if (_.isNil(DiscordConfigService._instance))
			DiscordConfigService._instance = new DiscordConfigService();
		return DiscordConfigService._instance;
	}

	public getDiscordToken(): string {
		const token = process.env.DISCORD_TOKEN;
		if (
			typeof token === `string` &&
			!_.isEmpty(token) &&
			!_.isNil(token) &&
			token !== `undefined`
		) {
			return token;
		}
		return this.MISSING_TOKEN;
	}
}
