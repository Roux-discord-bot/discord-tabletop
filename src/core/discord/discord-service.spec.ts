import { createMock } from "ts-auto-mock";
import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordService } from "./discord-service";
import { IDiscordConfig } from "./interfaces/discord-config-interface";
import { DiscordAuthenticationService } from "./services/discord-authentication-service";
import { DiscordConfigService } from "./services/discord-config-service";
import { DiscordEventService } from "./services/discord-event-service";

describe(`Discord Service`, () => {
	let service: DiscordService;
	let discordConfigService: DiscordConfigService;
	let discordEventService: DiscordEventService;
	let discordAuthenticationService: DiscordAuthenticationService;
	let loggerService: LoggerService;

	beforeAll(() => {
		discordConfigService = DiscordConfigService.getInstance();
		discordAuthenticationService = DiscordAuthenticationService.getInstance();
		discordEventService = DiscordEventService.getInstance();
		loggerService = LoggerService.getInstance();
	});

	describe(`::getInstance()`, () => {
		it(`should create a Discord service`, (): void => {
			expect.assertions(1);

			service = DiscordService.getInstance();

			expect(service).toStrictEqual(expect.any(DiscordService));
		});

		it(`should return the created Discord service`, (): void => {
			expect.assertions(1);

			const result = DiscordService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:start()`, () => {
		let loggerSuccessSpy: jest.SpyInstance;
		let loggerErrorSpy: jest.SpyInstance;
		let discordConfigServiceInitSpy: jest.SpyInstance;
		let discordAuthenticationServiceInitSpy: jest.SpyInstance;
		let discordEventServiceInitSpy: jest.SpyInstance;
		let discordConfigMock: IDiscordConfig;

		beforeEach(() => {
			service = new DiscordService();
			loggerSuccessSpy = jest
				.spyOn(loggerService, `success`)
				.mockImplementation();
			loggerErrorSpy = jest.spyOn(loggerService, `error`).mockImplementation();
			discordConfigServiceInitSpy = jest
				.spyOn(discordConfigService, `init`)
				.mockResolvedValue();
			discordEventServiceInitSpy = jest
				.spyOn(discordEventService, `init`)
				.mockResolvedValue();
			discordAuthenticationServiceInitSpy = jest
				.spyOn(discordAuthenticationService, `init`)
				.mockResolvedValue();
			discordConfigMock = createMock<IDiscordConfig>({
				discordToken: `EXAMPLE_TOKEN`,
			});
		});

		it(`should call DiscordConfigService:init()`, async () => {
			expect.assertions(1);

			await service.start(discordConfigMock);

			expect(discordConfigServiceInitSpy).toHaveBeenCalledTimes(1);
		});

		it(`should call DiscordEventService:init()`, async () => {
			expect.assertions(1);

			await service.start(discordConfigMock);

			expect(discordEventServiceInitSpy).toHaveBeenCalledTimes(1);
		});

		it(`should call DiscordAuthenticationService:init()`, async () => {
			expect.assertions(1);

			await service.start(discordConfigMock);

			expect(discordAuthenticationServiceInitSpy).toHaveBeenCalledTimes(1);
		});

		describe(`when one Promise in :start() returns a reject`, () => {
			beforeEach(() => {
				service = new DiscordService();
				discordAuthenticationServiceInitSpy = jest
					.spyOn(discordAuthenticationService, `init`)
					.mockRejectedValue(`error`);
			});

			it(`should return a rejected Promise containing an Error(err)`, async () => {
				expect.assertions(1);

				await service.start(discordConfigMock).catch(err => {
					expect(err).toStrictEqual(expect.any(Error));
				});
			});

			it(`should call LoggerService:error()`, async () => {
				expect.assertions(1);

				await service.start(discordConfigMock).catch(() => {
					expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe(`when all Promises in :start() resolves`, () => {
			beforeEach(() => {
				service = new DiscordService();
				discordAuthenticationServiceInitSpy = jest
					.spyOn(discordAuthenticationService, `init`)
					.mockResolvedValue();
			});

			it(`should not Throw`, async () => {
				expect.assertions(1);

				await expect(service.start(discordConfigMock)).resolves.not.toThrow();
			});

			it(`should resolves`, async () => {
				expect.assertions(1);

				await expect(service.start(discordConfigMock)).resolves.toBe(undefined);
			});

			it(`should call LoggerService:success()`, async () => {
				expect.assertions(1);

				await service.start(discordConfigMock).then(() => {
					expect(loggerSuccessSpy).toHaveBeenCalledTimes(1);
				});
			});
		});
	});
});
