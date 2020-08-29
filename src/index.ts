/* eslint-disable no-console */
import dotenv from "dotenv";
import path from "path";
import { exit } from "process";
import { DiscordService } from "./core/discord/discord-service";
import { DiscordCommandService } from "./core/discord/services/discord-command-service";
import { DiscordEventService } from "./core/discord/services/discord-event-service";

async function main(): Promise<void> {
	const config = dotenv.config();

	if (config.error) {
		throw config.error;
	}

	if (!config.parsed) {
		throw new Error(`FATAL error, cannot load the .env`);
	}

	await DiscordService.getInstance()
		.start({
			events: path.join(__dirname, `events`),
			commands: path.join(__dirname, `commands`),
			prefix: `!`,
			discordToken: config.parsed.DISCORD_TOKEN,
		})
		.then(() => {
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
		})
		.catch(error => {
			console.error(error);
			exit(1);
		});
}

main();
