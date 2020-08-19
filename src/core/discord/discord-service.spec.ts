import { LoggerService } from "../../utils/logger/logger-service";
import { DiscordService } from "./discord-service";
import { DiscordAuthenticationService } from "./services/discord-authentication-service";

describe(`Discord Service`, () => {
	let service: DiscordService;
	let discordAuthenticationService: DiscordAuthenticationService;
	let loggerService: LoggerService;

	beforeAll(() => {
		discordAuthenticationService = DiscordAuthenticationService.getInstance();
		loggerService = LoggerService.getInstance();
	});

	describe(`::getInstance()`, () => {
		it(`should create a DiscordAuthentication service`, (): void => {
			expect.assertions(1);

			service = DiscordService.getInstance();

			expect(service).toStrictEqual(expect.any(DiscordService));
		});

		it(`should return the created DiscordAuthentication service`, (): void => {
			expect.assertions(1);

			const result = DiscordService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:start()`, () => {
		let loggerSuccessSpy: jest.SpyInstance;
		let loggerErrorSpy: jest.SpyInstance;
		let discordAuthenticationServiceInitSpy: jest.SpyInstance;

		beforeEach(() => {
			service = new DiscordService();
			loggerSuccessSpy = jest
				.spyOn(loggerService, `success`)
				.mockImplementation();
			loggerErrorSpy = jest.spyOn(loggerService, `error`).mockImplementation();
			discordAuthenticationServiceInitSpy = jest
				.spyOn(discordAuthenticationService, `init`)
				.mockResolvedValue();
		});

		it(`should call DiscordAuthenticationService:init()`, async () => {
			expect.assertions(2);

			await service.start();

			expect(discordAuthenticationServiceInitSpy).toHaveBeenCalledTimes(1);
			expect(discordAuthenticationServiceInitSpy).toHaveBeenCalledWith();
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

				await service.start().catch(err => {
					expect(err).toStrictEqual(expect.any(Error));
				});
			});

			it(`should call LoggerService:error()`, async () => {
				expect.assertions(1);

				await service.start().catch(() => {
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

				await expect(service.start()).resolves.not.toThrow();
			});

			it(`should resolves`, async () => {
				expect.assertions(1);

				await expect(service.start()).resolves.toBe(undefined);
			});

			it(`should call LoggerService:success()`, async () => {
				expect.assertions(1);

				await service.start().then(() => {
					expect(loggerSuccessSpy).toHaveBeenCalledTimes(1);
				});
			});
		});
	});
});
