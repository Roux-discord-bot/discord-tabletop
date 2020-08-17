import _ from "lodash";
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

	describe(`:getClient()`, () => {
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

		it(`should return a client`, () => {
			expect.assertions(1);

			expect(service.getClient()).toBeDefined();
		});

		it(`should return the same client as created before`, () => {
			expect.assertions(1);

			expect(
				_.isEqual(service.createClient(), service.getClient())
			).toBeTruthy();
		});
	});
});
