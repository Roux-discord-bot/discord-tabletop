/* eslint-disable no-use-before-define */
/* eslint-disable no-console */
import dotenv, { DotenvParseOutput } from "dotenv";
import path from "path";
import { exit } from "process";
import { DiscordService } from "./core/discord/discord-service";
import { DiscordCommandService } from "./core/discord/services/discord-command-service";
import { DiscordEventService } from "./core/discord/services/discord-event-service";

async function main(config: DotenvParseOutput): Promise<void> {
	await DiscordService.getInstance()
		.start({
			events: path.join(__dirname, `events`),
			commands: path.join(__dirname, `commands`),
			langs: path.join(__dirname, `langs`),
			locale: `en`,
			prefix: `!`,
			discordToken: config.DISCORD_TOKEN,
			logger: {
				debug: false,
			},
			client: {
				owner: `230336648942977024`,
			},
		})
		.then(() => {
			printEventsAndCommands();
		})
		.catch(error => {
			console.error(error);
			exit(1);
		});
}

function printEventsAndCommands() {
	const events = DiscordEventService.getInstance()
		.getRepository()
		.all()
		.map(value => value.constructor.name);
	console.log(`events : [${events.join(`, `)}]`);

	const commands = DiscordCommandService.getInstance()
		.getRepository()
		.all()
		.map(value => value.constructor.name);
	console.log(`commands : [${commands.join(`, `)}]`);
}

const dotenvConfig = dotenv.config();

if (dotenvConfig.error) {
	throw dotenvConfig.error;
}

if (!dotenvConfig.parsed) {
	throw new Error(`FATAL error, cannot load the .env`);
}

main(dotenvConfig.parsed);
