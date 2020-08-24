import { DiscordEventHandler } from "./discord-event-handler";

describe(`Discord Event Handler`, () => {
	class DiscordEventHandlerMock extends DiscordEventHandler {
		constructor() {
			super(`ready`);
		}

		public handleEvent(): void {
			throw new Error(`Method not implemented.`);
		}
	}

	let eventHandlerMock: DiscordEventHandlerMock;

	beforeEach(() => {
		eventHandlerMock = new DiscordEventHandlerMock();
	});

	describe(`when the subclass does not specify any action`, () => {
		it(`should have the action [on]`, () => {
			expect.assertions(1);

			const action = eventHandlerMock.getAction();

			expect(action).toStrictEqual(`on`);
		});
	});
});
