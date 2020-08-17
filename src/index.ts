import dotenv from "dotenv";
import { DiscordAuthenticationService } from "./core/discord/services/discord-authentication-service";

dotenv.config();

const discord = DiscordAuthenticationService.getInstance();
discord.login();
