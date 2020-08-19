import dotenv from "dotenv";
import { DiscordService } from "./core/discord/discord-service";

dotenv.config();

DiscordService.getInstance().start();
