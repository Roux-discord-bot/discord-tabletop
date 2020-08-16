import { Collection } from "discord.js";
import DiscordAuthenticationService from "./core/services/discord-authentification-service";

const discord = DiscordAuthenticationService.getInstance();
discord.login();

const collection = new Collection();
collection.set(`hello`, `world`);
