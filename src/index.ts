import dotenv from "dotenv";
import path from "path";
import { DiscordService } from "./core/discord/discord-service";

const config = dotenv.config();

if (config.error) {
	throw config.error;
}

if (!config.parsed) {
	throw new Error(`Fatal error, cannot load the .env`);
}

DiscordService.getInstance().start({
	events: path.join(__dirname, `events`),
	discordToken: config.parsed.DISCORD_TOKEN,
});
