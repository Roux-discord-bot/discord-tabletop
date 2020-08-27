import dotenv from "dotenv";
import path from "path";
import { DiscordService } from "./core/discord/discord-service";
import { DiscordEventService } from "./core/discord/services/discord-event-service";

async function main() {
	const config = dotenv.config();

	if (config.error) {
		throw config.error;
	}

	if (!config.parsed) {
		throw new Error(`FATAL error, cannot load the .env`);
	}

	await DiscordService.getInstance().start({
		events: path.join(__dirname, `events`),
		commands: path.join(__dirname, `commands`),
		prefix: `!`,
		discordToken: config.parsed.DISCORD_TOKEN,
	});
	const events = DiscordEventService.getInstance().getRepository().all();
	console.log(`events :`);
	console.log(events);
}

main();
