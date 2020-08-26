import { Client } from "discord.js";
import { createMock } from "ts-auto-mock";
import { LoggerService } from "../../utils/logger/logger-service";
import {
	DiscordEventHandler,
	ClientListenerActionType,
} from "../features/discord-event-handler";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import { DiscordClientService } from "./discord-client-service";
import { DiscordEventService } from "./discord-event-service";

describe(`DiscordEventService`, () => {
	let service: DiscordEventService;
	let loggerService: LoggerService;
	let discordClientService: DiscordClientService;

	beforeAll(() => {
		service = new DiscordEventService();
		loggerService = LoggerService.getInstance();
		discordClientService = DiscordClientService.getInstance();
	});

	describe(`::getInstance()`, () => {
		it(`should create a DiscordEvent service`, (): void => {
			expect.assertions(1);

			service = DiscordEventService.getInstance();

			expect(service).toStrictEqual(expect.any(DiscordEventService));
		});

		it(`should return the created DiscordEvent service`, (): void => {
			expect.assertions(1);

			const result = DiscordEventService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:init()`, () => {
		let loggerServiceInfoSpy: jest.SpyInstance;
		let discordClientServiceGetClientSpy: jest.SpyInstance;
		let examplePath: IDiscordConfig;

		beforeEach(() => {
			loggerServiceInfoSpy = jest
				.spyOn(loggerService, `info`)
				.mockImplementation();
			discordClientServiceGetClientSpy = jest
				.spyOn(discordClientService, `getClient`)
				.mockReturnValue(createMock<Client>());
			examplePath = createMock<IDiscordConfig>({
				events: __dirname,
			});
		});

		it(`should call DiscordClientService:getClient()`, async () => {
			expect.assertions(2);

			await service.init(examplePath);

			expect(discordClientServiceGetClientSpy).toHaveBeenCalledTimes(1);
			expect(discordClientServiceGetClientSpy).toHaveBeenCalledWith();
		});

		it(`should return a Promise`, () => {
			expect.assertions(1);

			const promise = service.init(examplePath);

			expect(promise).toStrictEqual(expect.any(Promise));
		});

		describe(`when the scanDir return a non-empty array`, () => {
			let discordEventMock: DiscordEventHandler;
			let discordEventHandlerGetEventSpy: jest.SpyInstance;
			let discordEventHandlerGetActionSpy: jest.SpyInstance;

			beforeEach(() => {
				discordEventMock = createMock<DiscordEventHandler>();
				discordEventHandlerGetEventSpy = jest
					.spyOn(discordEventMock, `getEvent`)
					.mockReturnValue(`ready`);
				discordEventHandlerGetActionSpy = jest
					.spyOn(discordEventMock, `getAction`)
					.mockReturnValue(`on`);
				discordClientServiceGetClientSpy = jest.spyOn(
					discordEventMock,
					`getEvent`
				);
				jest
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					.spyOn<DiscordEventService, any>(service, `_fillEventHandlers`)
					.mockResolvedValue([discordEventMock]);
			});

			it(`should call LoggerService:info()`, async () => {
				expect.assertions(1);

				await service.init(examplePath);

				expect(loggerServiceInfoSpy).toHaveBeenCalledTimes(1);
			});

			it(`should not throw`, async () => {
				expect.assertions(1);

				const promise = service.init(examplePath);

				await expect(promise).resolves.not.toThrow();
			});

			it(`should resolves`, async () => {
				expect.assertions(1);

				const promise = service.init(examplePath);

				await expect(promise).resolves.toBe(undefined);
			});

			it(`should call eventHandler:getAction()`, async () => {
				expect.assertions(2);

				await service.init(examplePath);

				expect(discordEventHandlerGetActionSpy).toHaveBeenCalledTimes(1);
				expect(discordEventHandlerGetActionSpy).toHaveBeenCalledWith();
			});

			const cases = [[`on`], [`once`], [`off`]];
			describe.each(cases)(`for each available actions`, action => {
				beforeEach(() => {
					discordEventHandlerGetActionSpy = jest
						.spyOn(discordEventMock, `getAction`)
						.mockReturnValue(<ClientListenerActionType>action);
				});

				describe(`on action [${action}]`, () => {
					it(`should call eventHandler:getEvent()`, async () => {
						expect.assertions(2);

						await service.init(examplePath);

						expect(discordEventHandlerGetEventSpy).toHaveBeenCalledTimes(1);
						expect(discordEventHandlerGetEventSpy).toHaveBeenCalledWith();
					});
				});
			});

			describe(`on an invalid action`, () => {
				beforeEach(() => {
					discordEventHandlerGetActionSpy = jest
						.spyOn(discordEventMock, `getAction`)
						.mockReturnValue(<ClientListenerActionType>`invalid`);
				});

				it(`should throw`, async () => {
					expect.assertions(1);

					const promise = service.init(examplePath);

					await expect(promise).rejects.toThrow(expect.any(Error));
				});

				it(`should call eventHandler:getAction()`, async () => {
					expect.assertions(2);

					await service.init(examplePath).catch(() => {
						expect(discordEventHandlerGetActionSpy).toHaveBeenCalledTimes(1);
						expect(discordEventHandlerGetActionSpy).toHaveBeenCalledWith();
					});
				});

				it(`should not call eventHandler:getEvent()`, async () => {
					expect.assertions(1);

					await service.init(examplePath).catch(() => {
						expect(discordEventHandlerGetEventSpy).toHaveBeenCalledTimes(0);
					});
				});
			});
		});
	});
});
