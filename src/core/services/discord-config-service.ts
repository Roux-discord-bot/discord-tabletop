import _ from "lodash";
import DiscordConfigInterface from "../interfaces/discord-config-interface";
import discordConfig from "./discord-config";

export default class DiscordConfigService {
	private static _instance: DiscordConfigService;

	private _config: DiscordConfigInterface;

	public static getInstance(): DiscordConfigService {
		if (_.isNil(this._instance)) this._instance = new DiscordConfigService();
		return this._instance;
	}

	private constructor() {
		this._config = discordConfig;
	}

	public get config(): DiscordConfigInterface {
		return this._config;
	}
}
