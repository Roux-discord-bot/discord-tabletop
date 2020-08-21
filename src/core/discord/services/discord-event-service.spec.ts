import { Client } from "discord.js";
import { createMock } from "ts-auto-mock";
import * as dependency from "../../functions/recursive-read-dir";
import {
	DiscordEventHandler,
	EventAction,
} from "../features/discord-event-handler";
import { DiscordClientService } from "./discord-client-service";
import { DiscordEventService } from "./discord-event-service";

describe(`DiscordEventService`, () => {
	let service: DiscordEventService;
	let discordClientService: DiscordClientService;

	beforeAll(() => {
		discordClientService = DiscordClientService.getInstance();
		service = new DiscordEventService();
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

	describe(`:fillEventHandlers`, () => {
		let _importClassesFromPathSpy: jest.SpyInstance;

		beforeEach(() => {
			jest.spyOn(dependency, `recursiveReadDir`).mockReturnValue([``]);
			_importClassesFromPathSpy = jest
				.spyOn<DiscordEventService, any>(service, `_importClassesFromPath`)
				.mockReturnValue([``]);
		});

		it(`should call recursiveReadDir()`, async () => {
			expect.assertions(1);

			await service.fillEventHandlers(``);

			expect(dependency.recursiveReadDir).toHaveBeenCalledTimes(1);
		});

		it(`should call _importClassesFromPath()`, async () => {
			expect.assertions(1);

			await service.fillEventHandlers(``);

			expect(_importClassesFromPathSpy).toHaveBeenCalledTimes(1);
		});

		it(`should return an array`, async () => {
			expect.assertions(1);

			const result = await service.fillEventHandlers(``);

			expect(result).toStrictEqual(expect.any(Array));
		});

		describe(`when recursiveReadDir return an empty array`, () => {
			beforeEach(() => {
				jest.spyOn(dependency, `recursiveReadDir`).mockReturnValue([]);
			});

			it(`should not throw`, async () => {
				expect.assertions(1);

				const promise = service.fillEventHandlers(``);

				await expect(promise).resolves.not.toThrow();
			});

			it(`should resolve an empty array`, async () => {
				expect.assertions(1);

				const promise = service.fillEventHandlers(``);

				await expect(promise).resolves.toStrictEqual([]);
			});

			it(`should not call _importClassesFromPath()`, async () => {
				expect.assertions(1);

				await service.fillEventHandlers(``);

				expect(_importClassesFromPathSpy).toHaveBeenCalledTimes(0);
			});
		});

		describe(`when recursiveReadDir return a non-empty array`, () => {
			beforeEach(() => {
				jest
					.spyOn(dependency, `recursiveReadDir`)
					.mockReturnValue([`.`, `.`, `.`]);
			});

			it(`should not throw`, async () => {
				expect.assertions(1);

				const promise = service.fillEventHandlers(``);

				await expect(promise).resolves.not.toThrow();
			});

			it(`should resolve a non-empty array`, async () => {
				expect.assertions(2);

				await service.fillEventHandlers(``).then(result => {
					expect(result).toStrictEqual(expect.any(Array));
					expect(result.length).toBeGreaterThan(0);
				});
			});

			it(`should call _importClassesFromPath()`, async () => {
				expect.assertions(1);

				await service.fillEventHandlers(``);

				expect(_importClassesFromPathSpy).toHaveBeenCalled();
			});
		});
	});

	describe(`:init()`, () => {
		let discordClientServiceGetClientSpy: jest.SpyInstance;
		let serviceFillEventHandlersSpy: jest.SpyInstance;
		let examplePath: string;

		beforeEach(() => {
			discordClientServiceGetClientSpy = jest
				.spyOn(discordClientService, `getClient`)
				.mockReturnValue(createMock<Client>());
			serviceFillEventHandlersSpy = jest
				.spyOn(service, `fillEventHandlers`)
				.mockImplementation();
			examplePath = ``;
		});

		it(`should call DiscordClientService:getClient()`, async () => {
			expect.assertions(2);

			await service.init(examplePath);

			expect(discordClientServiceGetClientSpy).toHaveBeenCalledTimes(1);
			expect(discordClientServiceGetClientSpy).toHaveBeenCalledWith();
		});

		it(`should call DiscordEventService:fillEventHandlers()`, async () => {
			expect.assertions(2);

			await service.init(examplePath);

			expect(serviceFillEventHandlersSpy).toHaveBeenCalledTimes(1);
			expect(serviceFillEventHandlersSpy).toHaveBeenCalledWith(examplePath);
		});

		it(`should return a Promise`, () => {
			expect.assertions(1);

			const promise = service.init(examplePath);

			expect(promise).toStrictEqual(expect.any(Promise));
		});

		describe(`when fillEventHandlers return an empty array`, () => {
			beforeEach(() => {
				serviceFillEventHandlersSpy = jest
					.spyOn(service, `fillEventHandlers`)
					.mockResolvedValue([]);
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
		});

		describe(`when fillEventHandlers return a non-empty array`, () => {
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
				serviceFillEventHandlersSpy = jest
					.spyOn(service, `fillEventHandlers`)
					.mockResolvedValue([discordEventMock]);
				discordClientServiceGetClientSpy = jest.spyOn(
					discordEventMock,
					`getEvent`
				);
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
						.mockReturnValue(<EventAction>action);
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
						.mockReturnValue(<EventAction>`invalid`);
				});

				it(`should throw`, async () => {
					expect.assertions(1);

					const promise = service.init(examplePath);

					await expect(promise).rejects.toThrow(expect.any(Error));
				});

				it(`should call eventHandler:getAction()`, async () => {
					expect.assertions(2);

					await service.init(examplePath).catch(() => {
						expect(discordEventHandlerGetActionSpy).toHaveBeenCalledTimes(2);
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
