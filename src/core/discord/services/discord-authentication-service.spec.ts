import { Client } from "discord.js";
import { createMock } from "ts-auto-mock";
import { LoggerService } from "../../../utils/logger/logger-service";
import { DiscordAuthenticationService } from "./discord-authentication-service";
import { DiscordClientService } from "./discord-client-service";
import { DiscordConfigService } from "./discord-config-service";

describe(`Discord Authentification Service`, (): void => {
	let service: DiscordAuthenticationService;
	let discordClientService: DiscordClientService;
	let discordConfigService: DiscordConfigService;
	let loggerService: LoggerService;

	beforeEach((): void => {
		discordClientService = DiscordClientService.getInstance();
		discordConfigService = DiscordConfigService.getInstance();
		loggerService = LoggerService.getInstance();
	});

	describe(`::getInstance()`, () => {
		it(`should create a DiscordAuthentication service`, (): void => {
			expect.assertions(1);

			service = DiscordAuthenticationService.getInstance();

			expect(service).toStrictEqual(expect.any(DiscordAuthenticationService));
		});

		it(`should return the created DiscordAuthentication service`, (): void => {
			expect.assertions(1);

			const result = DiscordAuthenticationService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:login()`, () => {
		let client: Client;

		let discordClientServiceGetClientSpy: jest.SpyInstance;
		let discordConfigServiceGetDiscordTokenSpy: jest.SpyInstance;
		let loggerInfoSpy: jest.SpyInstance;
		let loggerErrorSpy: jest.SpyInstance;
		let loginMock: jest.Mock;

		beforeEach((): void => {
			service = new DiscordAuthenticationService();
			loginMock = jest.fn().mockResolvedValue(`login`);
			client = createMock<Client>({
				login: loginMock,
			});

			loggerInfoSpy = jest.spyOn(loggerService, `info`).mockImplementation();
			loggerErrorSpy = jest.spyOn(loggerService, `error`).mockImplementation();
			discordClientServiceGetClientSpy = jest
				.spyOn(discordClientService, `getClient`)
				.mockReturnValue(client);
			discordConfigServiceGetDiscordTokenSpy = jest
				.spyOn(discordConfigService, `getDiscordToken`)
				.mockReturnValue(`TEST_TOKEN`);
		});

		it(`should NOT be authenticated without login in`, async (): Promise<
			void
		> => {
			expect.assertions(1);

			expect(service.isAuthenticated()).toBeFalsy();
		});

		it(`should get the Discord client`, async (): Promise<void> => {
			expect.assertions(2);

			await service.login();

			expect(discordClientServiceGetClientSpy).toHaveBeenCalledTimes(1);
			expect(discordClientServiceGetClientSpy).toHaveBeenCalledWith();
		});

		it(`should get the Discord config`, async (): Promise<void> => {
			expect.assertions(2);

			await service.login();

			expect(discordConfigServiceGetDiscordTokenSpy).toHaveBeenCalled();
			expect(discordConfigServiceGetDiscordTokenSpy).toHaveBeenCalledWith();
		});

		it(`should login`, async (): Promise<void> => {
			expect.assertions(1);

			await service.login();

			expect(loginMock).toHaveBeenCalledTimes(1);
		});

		describe(`login was successful`, () => {
			beforeEach(() => {
				loginMock = jest.fn().mockResolvedValue(`success`);
				client = createMock<Client>({
					login: loginMock,
				});
				discordClientServiceGetClientSpy.mockReturnValue(client);
			});

			it(`should be authenticated`, async (): Promise<void> => {
				expect.assertions(1);

				await service.login().then(() => {
					expect(service.isAuthenticated()).toBeTruthy();
				});
			});

			it(`should call an info log`, async (): Promise<void> => {
				expect.assertions(1);

				await service.login().then(() => {
					expect(loggerInfoSpy).toHaveBeenCalledTimes(1);
				});
			});
		});

		describe(`login was a failure`, () => {
			beforeEach(() => {
				loginMock = jest.fn().mockRejectedValue(`error`);
				client = createMock<Client>({
					login: loginMock,
				});
				discordClientServiceGetClientSpy.mockReturnValue(client);
			});

			it(`should NOT be authenticated`, async (): Promise<void> => {
				expect.assertions(2);

				expect(service.isAuthenticated()).toBeFalsy();
				await service.login().catch(() => {
					expect(service.isAuthenticated()).toBeFalsy();
				});
			});

			it(`should call an error log`, async (): Promise<void> => {
				expect.assertions(1);

				await service.login().catch(() => {
					expect(loggerErrorSpy).toHaveBeenCalledTimes(1);
				});
			});

			it(`should return a rejected Promise`, async (): Promise<void> => {
				expect.assertions(1);

				await service.login().catch(err => {
					expect(err).toStrictEqual(expect.any(Error));
				});
			});
		});
	});

	describe(`:init()`, () => {
		let serviceLoginSpy: jest.SpyInstance;

		beforeEach(() => {
			service = new DiscordAuthenticationService();
			serviceLoginSpy = jest.spyOn(service, `login`).mockResolvedValue();
		});

		it(`should call login() once`, async () => {
			expect.assertions(2);

			await service.init();

			expect(serviceLoginSpy).toHaveBeenCalledTimes(1);
			expect(serviceLoginSpy).toHaveBeenCalledWith();
		});

		describe(`when login() returned Promise is rejected`, () => {
			beforeEach(() => {
				serviceLoginSpy = jest
					.spyOn(service, `login`)
					.mockRejectedValue(`error`);
			});

			it(`should return a rejected Promise`, async () => {
				expect.assertions(1);

				await service.init().catch(err => {
					expect(err).toStrictEqual(`error`);
				});
			});
		});

		describe(`when login() returned Promise is resolved`, () => {
			beforeEach(() => {
				serviceLoginSpy = jest.spyOn(service, `login`).mockResolvedValue();
			});

			it(`should not Throw`, async () => {
				expect.assertions(1);

				await expect(service.init()).resolves.not.toThrow();
			});

			it(`should resolves`, async () => {
				expect.assertions(1);

				await expect(service.init()).resolves.toBe(undefined);
			});
		});
	});
});
