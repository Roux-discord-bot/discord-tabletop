import { ClientEvents } from "discord.js";
import { LoggerService } from "../../../utils/logger/logger-service";

export type EventType = keyof ClientEvents;

export type EventAction = `on` | `once` | `off`;

export abstract class DiscordEventHandler {
	protected readonly _event: EventType;

	protected readonly _action: EventAction;

	constructor(context: string, event: EventType, action?: EventAction) {
		this._event = event;
		this._action = action || `on`;
		LoggerService.getInstance().info({
			context,
			message: `Adding Event handler on '${this._event}' with action [${this._action}]`,
		});
	}

	public getEvent(): EventType {
		return this._event;
	}

	public getAction(): EventAction {
		return this._action;
	}

	public abstract handleEvent(args: unknown[]): void;
}
