import { getInstancesFromFolder } from "../../functions/recursive-get-classes-dir";
import { DiscordEvent } from "../classes/discord-event";
import { Repository } from "../../classes/repository";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordClientService } from "../services/discord-client-service";
import { DiscordClient } from "../classes/discord-client";

export class DiscordEventRepository extends Repository<DiscordEvent> {
	private _isBuilt = false;

	private _client!: DiscordClient;

	public async build(eventsPath: string): Promise<void> {
		if (this._isBuilt) throw new Error(`A Repository can only be built once !`);
		return getInstancesFromFolder<DiscordEvent>(eventsPath).then(
			async discordEvents => {
				this._client = DiscordClientService.getInstance().getClient();
				return this._registerEachDiscordEvent(discordEvents).then(() => {
					this._isBuilt = true;
				});
			}
		);
	}

	public async registerDiscordEvent(discordEvent: DiscordEvent): Promise<void> {
		if (!this._isBuilt)
			throw new Error(
				`The repository needs to be built before being fully available !`
			);
		return this._registerDiscordEvent(discordEvent);
	}

	private async _registerEachDiscordEvent(
		discordEvents: DiscordEvent[]
	): Promise<void> {
		return new Promise((resolve, reject) => {
			discordEvents.forEach(discordEvent => {
				this._registerDiscordEvent(discordEvent).catch(reject);
			});
			resolve();
		});
	}

	private async _registerDiscordEvent(
		discordEvent: DiscordEvent
	): Promise<void> {
		if (!this._client)
			throw new Error(`The Client in the respository is undefined !`);
		discordEvent.buildEventsForClient(this._client).then(() => {
			this.add(discordEvent);
			LoggerService.getInstance().info({
				context: `DiscordEventRepository`,
				message: `${discordEvent.constructor.name} successfully assigned to the Discord client`,
			});
		});
	}
}
