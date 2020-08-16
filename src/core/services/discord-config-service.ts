/* eslint-disable class-methods-use-this */
import _ from "lodash";
import IDiscordConfig from "../interfaces/discord-config-interface";
import discordConfig from "./discord-config";

export default class DiscordConfigService implements IDiscordConfig {
	private static _instance: DiscordConfigService;

	public static getInstance(): DiscordConfigService {
		if (_.isNil(DiscordConfigService._instance))
			DiscordConfigService._instance = new DiscordConfigService();
		return DiscordConfigService._instance;
	}

	public getDiscordToken(): string {
		return discordConfig.getDiscordToken();
	}

	public getSafeToPrintDiscordToken(): string {
		const token = discordConfig.getDiscordToken();
		const lastDotIndex = token.lastIndexOf(`.`) + 1;
		return (
			token.substring(0, lastDotIndex) +
			token.substring(lastDotIndex).replace(/./g, `*`)
		);
	}
}
