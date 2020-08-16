import dotenv from "dotenv";
import { Collection } from "discord.js";
import DiscordAuthenticationService from "./core/services/discord-authentification-service";

dotenv.config();

const discord = DiscordAuthenticationService.getInstance();
discord.login();

const collection = new Collection();
collection.set(`hello`, `world`);
