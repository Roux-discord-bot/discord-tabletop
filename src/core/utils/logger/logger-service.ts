/* eslint-disable class-methods-use-this */
import chalk from "chalk";
import { oneLine } from "common-tags";
import _ from "lodash";
import timestamp from "time-stamp";
import { ILogger } from "./logger-interface";

export interface ILoggerConfig {
	/**
	 * @default true
	 */
	debug?: boolean;

	/**
	 * @default true
	 */
	info?: boolean;

	/**
	 * @default true
	 */
	success?: boolean;

	/**
	 * @default true
	 */
	warn?: boolean;

	/**
	 * @default true
	 */
	error?: boolean;
}

export class LoggerService {
	private static _instance: LoggerService;

	public static getInstance(): LoggerService {
		if (_.isNil(LoggerService._instance))
			LoggerService._instance = new LoggerService();

		return LoggerService._instance;
	}

	private _logHistory: string[] = [];

	private _loggerConfig: ILoggerConfig = {
		debug: true,
		info: true,
		success: true,
		warn: true,
		error: true,
	};

	public async init(config: ILoggerConfig): Promise<void> {
		this._loggerConfig = {
			...this._loggerConfig,
			...config,
		};
	}

	public debug(options: ILogger): void {
		if (this._loggerConfig.debug) this.log(`DEBUG`, options);
	}

	public info(options: ILogger): void {
		if (this._loggerConfig.info)
			this.log(`INFO`, {
				chalkHeader: chalk.blueBright,
				...options,
			});
	}

	public success(options: ILogger): void {
		if (this._loggerConfig.success)
			this.log(`SUCCESS`, {
				chalkHeader: chalk.green,
				...options,
			});
	}

	public warn(options: ILogger): void {
		if (this._loggerConfig.warn)
			this.log(`WARN`, {
				chalkHeader: chalk.bold.yellow,
				...options,
			});
	}

	public error(options: ILogger): void {
		if (this._loggerConfig.error)
			this.log(`ERROR`, {
				chalkHeader: chalk.bold.red,
				...options,
			});
	}

	public log(header: string, options: ILogger): void {
		const log = this._createLog(header, {
			chalkMessage: chalk.whiteBright,
			...options,
		});
		if (!log || log.length === 0) return;
		if (options.save !== false) this._logHistory.push(log);

		// eslint-disable-next-line no-console
		console.log(log);
	}

	private _createLog(header: string, options: ILogger): string {
		const chalkWholeLine = options.chalkWholeLine || chalk;
		const chalkTimestamp = options.chalkTimestamp || chalk;
		const chalkHeader = options.chalkHeader || chalk;
		const chalkContext = options.chalkContext || chalk;
		const chalkMessage = options.chalkMessage || chalk;

		return chalkWholeLine(
			oneLine(
				`${chalkTimestamp(this._getTimestamp())}
				- [${chalkHeader(header)}][${chalkContext(options.context)}]
				- ${chalkMessage(options.message)}`
			)
		);
	}

	public getLogHistory(): Readonly<string[]> {
		return this._logHistory;
	}

	private _getTimestamp(): string {
		return timestamp(`HH:mm:ss.ms`);
	}
}
