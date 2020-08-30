import { Client } from "discord.js";
import { CustomEvents } from "../../interfaces/custom-events-interface";
import { IDiscordClientOptions } from "../interfaces/discord-client-options-interface";

export class DiscordClient extends Client {
	private _options: IDiscordClientOptions = {};

	constructor(options?: IDiscordClientOptions) {
		super(options);
		if (options) this._options = options;
	}

	public getOption<K extends keyof IDiscordClientOptions>(
		key: K
	): IDiscordClientOptions[K] {
		return this.getOptions()[key];
	}

	public getOptions(): Readonly<IDiscordClientOptions> {
		return this._options;
	}

	public on<K extends keyof CustomEvents>(
		event: K,
		listener: (...args: CustomEvents[K]) => void
	): this;

	public on<S extends string | symbol>(
		event: Exclude<S, keyof CustomEvents>,
		listener: (...args: unknown[]) => void
	): this;

	public on(event: string, listener: (...args: unknown[]) => void): this {
		super.on(event, listener);
		return this;
	}
}
