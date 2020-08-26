import dotenv from "dotenv";
import path from "path";
import { DiscordService } from "./core/discord/discord-service";

const config = dotenv.config();

if (config.error) {
	throw config.error;
}

if (!config.parsed) {
	throw new Error(`FATAL error, cannot load the .env`);
}

DiscordService.getInstance().start({
	events: path.join(__dirname, `events`),
	commands: path.join(__dirname, `commands`),
	prefix: `!`,
	discordToken: config.parsed.DISCORD_TOKEN,
});
