import { Client } from "discord.js";
import { getInstancesFromFolder } from "../../functions/recursive-get-classes-dir";
import { DiscordEventHandler } from "../features/discord-event-handler";
import { Repository } from "../../features/repository";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordClientService } from "../services/discord-client-service";

export class DiscordEventRepository extends Repository<DiscordEventHandler> {
	private _isBuilt = false;

	private _client: Client | undefined;

	public async build(eventsPath: string): Promise<void> {
		if (this._isBuilt) throw new Error(`A Repository can only be built once !`);
		const eventHandlers = await getInstancesFromFolder<DiscordEventHandler>(
			eventsPath
		);
		this._client = DiscordClientService.getInstance().getClient();
		await this._registerEachEventHandlers(eventHandlers);
		this._isBuilt = true;
	}

	public async registerEventHandler(
		eventHandler: DiscordEventHandler
	): Promise<void> {
		if (!this._isBuilt)
			throw new Error(
				`The repository needs to be built before being fully available !`
			);
		return this._registerEventHandler(eventHandler);
	}

	private async _registerEachEventHandlers(
		eventHandlers: DiscordEventHandler[]
	): Promise<void> {
		return new Promise((resolve, reject) => {
			eventHandlers.forEach(eventHandler => {
				this._registerEventHandler(eventHandler).catch(reject);
			});
			resolve();
		});
	}

	private async _registerEventHandler(
		eventHandler: DiscordEventHandler
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
