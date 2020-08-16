import { Client } from "discord.js";
import _ from "lodash";
import DiscordConfigService from "./discord-config-service";
import DiscordConfigInterface from "../interfaces/discord-config-interface";
import logger from "../utils/logger";

export default class DiscordAuthentificationService {
	private static instance: DiscordAuthentificationService;

	private _client: Client | undefined;

	private _config: DiscordConfigInterface;

	private constructor() {
		this._config = DiscordConfigService.getInstance().config;
	}

	public static getInstance(): DiscordAuthentificationService {
		if (_.isNil(this.instance))
			this.instance = new DiscordAuthentificationService();
		return this.instance;
	}

	public login(): Promise<string> {
		if (this.isAuthentificated())
			throw new Error(`The client is already logged in !`);
		this._client = new Client().on(`ready`, () => {
			logger.logEvent(`Ready`, `Client is logged in and ready!`);
		});
		return this._client.login(this._config.DISCORD_TOKEN);
	}

	public logout(): void {
		if (!this.isAuthentificated()) return;
		this._client?.destroy();
		this._client = undefined;
	}

	public isAuthentificated(): boolean {
		return !_.isNil(this._client);
	}

	public get client(): Client | undefined {
		return this._client;
	}
}
