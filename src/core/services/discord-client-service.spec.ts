import { Client } from "discord.js";
import { createMock } from "ts-auto-mock";
import DiscordClientService from "./discord-client-service";

describe(`Discord Client Service`, () => {
	let service: DiscordClientService;

	describe(`::getInstance()`, () => {
		it(`should create a DiscordClientService`, (): void => {
			expect.assertions(1);

			service = DiscordClientService.getInstance();

			expect(service).toStrictEqual(expect.any(DiscordClientService));
		});

		it(`should return the created DiscordClientService`, (): void => {
			expect.assertions(1);

			const result = DiscordClientService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:createClient()`, () => {
		beforeEach(() => {
			service = new DiscordClientService();
		});

		it(`should return a client`, () => {
			expect.assertions(1);

			const result = service.createClient();

			expect(result).toStrictEqual(expect.any(Client));
		});

		it(`should return a different client each call`, () => {
			expect.assertions(1);

			const firstCall = service.createClient();
			const secondCall = service.createClient();

			expect(firstCall).not.toStrictEqual(secondCall);
		});
	});

	describe(`:getClient()`, () => {
		beforeEach(() => {
			service = new DiscordClientService();
		});

		it(`should return a client`, () => {
			expect.assertions(1);

			const result = service.getClient();

			expect(result).toStrictEqual(expect.any(Client));
		});

		describe(`with no client created before`, () => {
			let discordClientServiceCreateClientSpy: jest.SpyInstance;
			let client: Client;

			beforeEach(() => {
				service = new DiscordClientService();
				client = createMock<Client>();
				discordClientServiceCreateClientSpy = jest
					.spyOn(service, `createClient`)
					.mockReturnValue(client);
			});

			it(`should call createClient()`, () => {
				expect.assertions(2);

				service.getClient();

				expect(discordClientServiceCreateClientSpy).toHaveBeenCalledTimes(1);
				expect(discordClientServiceCreateClientSpy).toHaveBeenCalledWith();
			});
		});

		describe(`with a client created before`, () => {
			let discordClientServiceCreateClientSpy: jest.SpyInstance;
			let client: Client;

			beforeEach(() => {
				service = new DiscordClientService();
				client = service.createClient();
				discordClientServiceCreateClientSpy = jest
					.spyOn(service, `createClient`)
					.mockImplementation();
			});

			it(`should NOT call createClient()`, () => {
				expect.assertions(1);

				service.getClient();

				expect(discordClientServiceCreateClientSpy).not.toHaveBeenCalled();
			});

			it(`should return the same client as created before`, () => {
				expect.assertions(1);

				const result = service.getClient();

				expect(client).toStrictEqual(result);
			});
		});
	});
});
