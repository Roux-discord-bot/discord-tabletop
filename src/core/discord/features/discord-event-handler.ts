import { ClientEvents } from "discord.js";

export type EventType = keyof ClientEvents;

export interface ClientActions {
	on: string;
	once: string;
	off: string;
}

export type EventAction = keyof ClientActions;

export abstract class DiscordEventHandler {
	protected readonly _event: EventType;

	protected readonly _action: EventAction;

	constructor(event: EventType, action?: EventAction) {
		this._event = event;
		this._action = action || `on`;
	}

	public getEvent(): EventType {
		return this._event;
	}

	public getAction(): EventAction {
		return this._action;
	}

	public abstract handleEvent(args: unknown[]): void;
}
