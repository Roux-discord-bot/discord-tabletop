import IDiscordConfig from "../interfaces/discord-config-interface";

const config: IDiscordConfig = {
	getDiscordToken(): string {
		return process.env.DISCORD_TOKEN ? process.env.DISCORD_TOKEN : `empty`;
	},
};

export default config;
