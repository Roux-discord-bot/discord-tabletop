import DiscordAuthentificationService from "./core/services/discord-authentification-service";

const discord = DiscordAuthentificationService.getInstance();
discord.login();
