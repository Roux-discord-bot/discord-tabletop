import dotenv from "dotenv";
import path from "path";
import { DiscordService } from "./core/discord/discord-service";

dotenv.config();

DiscordService.getInstance().start({
	events: path.join(__dirname, `events`),
});
