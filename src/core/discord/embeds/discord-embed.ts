import { ColorResolvable, MessageEmbed, MessageEmbedOptions } from "discord.js";
import { resolveColor, IColors } from "../../utils/colors";

export class DiscordEmbed extends MessageEmbed {
	constructor(data?: MessageEmbed | MessageEmbedOptions) {
		super(data);
		this.setColor(`LIGHT_BLUE`)
			.setAuthor(`Roux`, `https://i.imgur.com/NNKJUkI.png`)
			.setFooter(`Example footer`)
			.setTimestamp();
	}

	public setColor(color: keyof IColors): this;

	public setColor(color: ColorResolvable): this;

	public setColor(color: ColorResolvable): this {
		super.setColor(resolveColor(color));
		return this;
	}
}
