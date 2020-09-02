import { PermissionString } from "discord.js";

export interface IDiscordCommandData {
	name: string;
	description: string;
	aliases: string[];
	guildOnly: boolean;
	cooldown: number;
	permissions: Array<PermissionString>;
}
