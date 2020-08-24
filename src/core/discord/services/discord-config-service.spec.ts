import { createMock } from "ts-auto-mock";
import { IDiscordConfig } from "../interfaces/discord-config-interface";
import { DiscordConfigService } from "./discord-config-service";

describe(`Discord Config Service`, () => {
	let service: DiscordConfigService;

	describe(`::getInstance()`, () => {
		it(`should create a DiscordConfigService`, (): void => {
			expect.assertions(1);

			service = DiscordConfigService.getInstance();

			expect(service).toStrictEqual(expect.any(DiscordConfigService));
		});

		it(`should return the created DiscordConfigService`, (): void => {
			expect.assertions(1);

			const result = DiscordConfigService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:init()`, () => {
		const exampleToken = `test`;
		let discordConfig: IDiscordConfig;

		beforeEach(async () => {
			service = new DiscordConfigService();
			discordConfig = createMock<IDiscordConfig>({
				discordToken: exampleToken,
			});
		});

		describe(`when the token from the config is valid`, () => {
			it(`should not throw`, async () => {
				expect.assertions(1);

				const promise = service.init(discordConfig);

				await expect(promise).resolves.not.toThrow();
			});

			it(`should return a resolved Promise`, async () => {
				expect.assertions(1);

				const promise = service.init(discordConfig);

				await expect(promise).resolves.toBe(undefined);
			});
		});

		describe(`when the token from the config is missing/undefined`, () => {
			beforeEach(async () => {
				service = new DiscordConfigService();
				discordConfig = createMock<IDiscordConfig>({
					discordToken: undefined,
				});
			});

			it(`should throw`, async () => {
				expect.assertions(1);

				const promise = service.init(discordConfig);

				await expect(promise).rejects.toThrow();
			});
		});
	});

	describe(`:getDiscordToken()`, () => {
		const exampleToken = `test`;

		beforeEach(async () => {
			const config = createMock<IDiscordConfig>({
				discordToken: exampleToken,
			});
			service = new DiscordConfigService();
			await service.init(config);
		});

		it(`should return a string`, () => {
			expect.assertions(1);

			const token = service.getDiscordToken();

			expect(token).toStrictEqual(expect.any(String));
		});

		describe(`when the token in the config is valid`, () => {
			it(`should return the token`, () => {
				expect.assertions(1);

				const token = service.getDiscordToken();

				expect(token).toStrictEqual(exampleToken);
			});
		});

		describe(`when the token in the config is missing/undefined/invalid`, () => {
			beforeEach(async () => {
				const config = createMock<IDiscordConfig>({
					discordToken: undefined,
				});
				service = new DiscordConfigService();
				await service.init(config).catch(() => {
					/* tips to disable empty brackets */
				});
			});

			it(`should return an empty string`, () => {
				expect.assertions(1);

				const token = service.getDiscordToken();

				expect(token).toStrictEqual(``);
			});
		});
	});
});
