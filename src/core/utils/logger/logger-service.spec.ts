import { createMock } from "ts-auto-mock";
import { ILogger } from "./logger-interface";
import { LoggerService } from "./logger-service";

describe(`Logger Service`, () => {
	let service: LoggerService;
	let consoleLogSpy: jest.SpyInstance;
	let loggerMock: ILogger;

	beforeEach(() => {
		service = new LoggerService();
		consoleLogSpy = jest.spyOn(console, `log`).mockImplementation();
		loggerMock = createMock<ILogger>();
	});

	describe(`::getInstance()`, () => {
		it(`should create a DiscordAuthentication service`, (): void => {
			expect.assertions(1);

			service = LoggerService.getInstance();

			expect(service).toStrictEqual(expect.any(LoggerService));
		});

		it(`should return the created DiscordAuthentication service`, (): void => {
			expect.assertions(1);

			const result = LoggerService.getInstance();

			expect(result).toStrictEqual(service);
		});
	});

	describe(`:createLog()`, () => {
		it(`should NOT call the console.log()`, () => {
			expect.assertions(1);

			service.createLog(`HEADER`, loggerMock);

			expect(consoleLogSpy).not.toHaveBeenCalled();
		});
	});

	describe(`:log()`, () => {
		let serviceCreateLogSpy: jest.SpyInstance;

		beforeEach(() => {
			serviceCreateLogSpy = jest
				.spyOn(service, `createLog`)
				.mockImplementation();
		});

		it(`should call createLog()`, () => {
			expect.assertions(1);

			service.log(`TEST`, loggerMock);

			expect(serviceCreateLogSpy).toHaveBeenCalledTimes(1);
		});

		describe(`when createLog() return an empty string`, () => {
			beforeEach(() => {
				serviceCreateLogSpy = jest
					.spyOn(service, `createLog`)
					.mockReturnValue(``);
			});

			it(`should not add it to the _logHistory`, () => {
				expect.assertions(1);

				service.log(`TEST`, loggerMock);
				const { length } = service.getLogHistory();

				expect(length).toStrictEqual(0);
			});

			it(`should not call console.log()`, () => {
				expect.assertions(1);

				service.log(`TEST`, loggerMock);

				expect(consoleLogSpy).not.toHaveBeenCalled();
			});
		});

		describe(`when createLog() return a valid log`, () => {
			beforeEach(() => {
				serviceCreateLogSpy = jest
					.spyOn(service, `createLog`)
					.mockReturnValue(`completely valid log`);
			});

			it(`should add it to the _logHistory`, () => {
				expect.assertions(1);

				service.log(`TEST`, loggerMock);
				const { length } = service.getLogHistory();

				expect(length).toStrictEqual(1);
			});

			it(`should call console.log() once`, () => {
				expect.assertions(1);

				service.log(`TEST`, loggerMock);

				expect(consoleLogSpy).toHaveBeenCalledTimes(1);
			});
		});
	});

	describe(`for each type of log in [debug, info, success, warn, error]`, () => {
		let serviceLogSpy: jest.SpyInstance;

		beforeEach(() => {
			service = new LoggerService();
			serviceLogSpy = jest.spyOn(service, `log`).mockImplementation();
		});

		it(`they should all call this.log()`, () => {
			expect.assertions(1);

			service.debug(loggerMock);
			service.info(loggerMock);
			service.success(loggerMock);
			service.warn(loggerMock);
			service.error(loggerMock);

			expect(serviceLogSpy).toHaveBeenCalledTimes(5);
		});

		it(`NONE of them should call console.log() ITSELF`, () => {
			expect.assertions(1);

			service.debug(loggerMock);
			service.info(loggerMock);
			service.success(loggerMock);
			service.warn(loggerMock);
			service.error(loggerMock);

			expect(consoleLogSpy).not.toHaveBeenCalled();
		});
	});

	describe(`_logHistory`, () => {
		it(`should be defined upon new LoggerService`, () => {
			expect.assertions(1);

			const logHistory = service.getLogHistory();

			expect(logHistory).toBeDefined();
		});

		it(`should be empty upon new LoggerService`, () => {
			expect.assertions(1);

			const logHistory = service.getLogHistory();

			expect(logHistory).toHaveLength(0);
		});

		it(`should increase by one for each new log`, () => {
			expect.assertions(1);

			service.debug(loggerMock);
			service.info(loggerMock);
			service.warn(loggerMock);
			service.success(loggerMock);
			service.error(loggerMock);

			expect(service.getLogHistory()).toHaveLength(5);
		});

		it(`should increase when using the option save to true`, () => {
			expect.assertions(1);

			service.debug({
				save: true,
				...loggerMock,
			});

			expect(service.getLogHistory()).toHaveLength(1);
		});

		it(`should NOT increase when using the option save to false`, () => {
			expect.assertions(1);

			service.debug({
				save: false,
				...loggerMock,
			});

			expect(service.getLogHistory()).toHaveLength(0);
		});
	});
});
