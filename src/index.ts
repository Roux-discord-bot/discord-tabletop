import { Client } from "discord.js";
import secrets from "./secrets";

const client: Client = new Client();

client.on(`ready`, () => {
	if (client.user)
		process.stdout.write(
			`Client is logged in as ${client.user.tag} and ready!`
		);
});

client.on(`message`, msg => {
	if (msg.content === `ping`) {
		msg.channel.send(`pong`);
	}
});

client.login(secrets.DISCORD_TOKEN);
