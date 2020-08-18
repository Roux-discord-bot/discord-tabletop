import chalk from "chalk";

export interface ILogger {
	context: string;
	message: string;
	/**
	 * @default true
	 */
	save?: boolean;
	chalkWholeLine?: chalk.Chalk;
	chalkTimestamp?: chalk.Chalk;
	chalkHeader?: chalk.Chalk;
	chalkContext?: chalk.Chalk;
	chalkMessage?: chalk.Chalk;
}
