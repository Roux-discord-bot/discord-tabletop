/* eslint-disable no-console */
import _ from "lodash";
import chalk from "chalk";

export function log(message: string, options?: chalk.Chalk): void {
	if (!_.isNil(options))
		console.log(`[${chalk.blueBright`INFO`}] ${options(message)}`);
	else console.log(`[${chalk.blueBright`INFO`}] ${message}`);
}

export function logEvent(event: string, message: string): void {
	console.log(`${chalk.bgBlue.bold.black`[${event}]`} ${message}`);
}

export function warn(message: string, options?: chalk.Chalk): void {
	if (!_.isNil(options)) console.log(options`[WARN] ${message}`);
	else console.log(chalk.bold.yellow`[WARN] ${message}`);
}

export function warnEvent(event: string, message: string): void {
	console.log(
		`${chalk.bgYellow.bold.black`[${event}]`} ${chalk.bold.yellow`${message}`}`
	);
}

export function error(message: string, options?: chalk.Chalk): void {
	if (!_.isNil(options)) console.log(options`[ERROR] ${message}`);
	else console.log(chalk.bgRed.bold.black`[ERROR] ${message}`);
}

export function errorEvent(event: string, message: string): void {
	console.log(
		`${chalk.bgRed.bold.black`[${event}]`}${chalk.bgRed.bold
			.black` ${message}`}`
	);
}

export default {
	log,
	logEvent,
	warn,
	warnEvent,
	error,
	errorEvent,
};
