import _ from "lodash";
import { IDiscordConfig } from "../interfaces/discord-config-interface";

export class DiscordConfigService {
	private static _instance: DiscordConfigService;

	private _discordToken = ``;

	public static getInstance(): DiscordConfigService {
		if (_.isNil(DiscordConfigService._instance))
			DiscordConfigService._instance = new DiscordConfigService();
		return DiscordConfigService._instance;
	}

	public async init({ discordToken }: IDiscordConfig): Promise<void> {
		if (!discordToken)
			throw new Error(`The discord token is missing from the config !`);
		this._discordToken = discordToken;
	}

	public getDiscordToken(): string {
		return this._discordToken;
	}
}
