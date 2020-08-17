import dotenv from "dotenv";
import DiscordAuthenticationService from "./core/discord/services/discord-authentification-service";

dotenv.config();

const discord = DiscordAuthenticationService.getInstance();
discord.login();
