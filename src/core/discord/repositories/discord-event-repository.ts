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
		const eventHandlers = await getInstancesFromFolder<DiscordEvent>(
			eventsPath
		);
		this._client = DiscordClientService.getInstance().getClient();
		await this._registerEachEventHandlers(eventHandlers);
		this._isBuilt = true;
	}

	public async registerEventHandler(eventHandler: DiscordEvent): Promise<void> {
		if (!this._isBuilt)
			throw new Error(
				`The repository needs to be built before being fully available !`
			);
		return this._registerEventHandler(eventHandler);
	}

	private async _registerEachEventHandlers(
		eventHandlers: DiscordEvent[]
	): Promise<void> {
		return new Promise((resolve, reject) => {
			eventHandlers.forEach(eventHandler => {
				this._registerEventHandler(eventHandler).catch(reject);
			});
			resolve();
		});
	}

	private async _registerEventHandler(
		eventHandler: DiscordEvent
	): Promise<void> {
		if (!this._client)
			throw new Error(`The Client in the respository is undefined !`);
		await eventHandler.assignEventsToClient(this._client);
		this.add(eventHandler);
		LoggerService.getInstance().info({
			context: `DiscordEventRepository`,
			message: `${eventHandler.constructor.name} successfully assigned to the Discord client`,
		});
	}
}
