import _ from "lodash";
import { DiscordClient } from "../classes/discord-client";

export class DiscordClientService {
	private static _instance: DiscordClientService;

	private _client: DiscordClient | undefined = undefined;

	public static getInstance(): DiscordClientService {
		if (_.isNil(DiscordClientService._instance))
			DiscordClientService._instance = new DiscordClientService();

		return DiscordClientService._instance;
	}

	private _createClient(): DiscordClient {
		this._client = new DiscordClient();

		return this._client;
	}

	public getClient(): DiscordClient {
		if (_.isNil(this._client)) return this._createClient();
		return this._client;
	}
}
