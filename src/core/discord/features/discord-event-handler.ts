import { ClientEvents } from "discord.js";

export type ClientEventType = keyof ClientEvents;

interface IClientListenerActions {
	on: string;
	once: string;
	off: string;
}

export type ClientListenerActionType = keyof IClientListenerActions;

export abstract class DiscordEventHandler {
	protected readonly _event: ClientEventType;

	protected readonly _action: ClientListenerActionType;

	constructor(event: ClientEventType, action?: ClientListenerActionType) {
		this._event = event;
		this._action = action || `on`;
	}

	public getEvent(): ClientEventType {
		return this._event;
	}

	public getAction(): ClientListenerActionType {
		return this._action;
	}

	public abstract handleEvent(args: unknown[]): void;
}
