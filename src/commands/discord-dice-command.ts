import { Message } from "discord.js";
import _, { random } from "lodash";
import { DiscordCommand } from "../core/discord/classes/discord-command";

type Bounds = {
	min: number;
	max: number;
};

export class DiscordCooldownTestCommand extends DiscordCommand {
	private readonly DEFAULT_MIN = 1;

	private readonly DEFAULT_MAX = 6;

	constructor() {
		super(`roll`, {
			aliases: [`dice`],
			description: `Roll a dice, range can be specified, default is 1 to 6.`,
			usage: `!roll [min? | max?]=1 [max?]=6\n\`\`\` !roll 1 20\`\`\`to roll a number between 1 and 20. The same roll can be achieved writing :\n\`\`\` !roll 20\`\`\``,
			cooldown: 3,
		});
	}

	protected async handleCommand(
		message: Message,
		...args: string[]
	): Promise<Message> {
		if (args.length > 2) {
			return this.sendUsageError(
				message,
				this,
				`This command can not take more than 2 arguments`
			);
		}

		const bounds = await this._computeBounds(message, args);
		if (`min` in bounds && `max` in bounds) {
			const result = random(bounds.min, bounds.max, false);
			return message.channel.send(`You rolled : ${result}`);
		}
		return message;
	}

	private async _computeBounds(
		message: Message,
		args: string[]
	): Promise<Message | Bounds> {
		let min = this.DEFAULT_MIN;
		if (args.length > 0) {
			min = this._asNumber(args[0]);
			if (_.isNaN(min)) {
				return this.sendUsageError(
					message,
					this,
					`The first given value is not a valid number !`
				);
			}
		}

		let max = this.DEFAULT_MAX;
		if (args.length > 1) {
			max = this._asNumber(args[1]);
			if (_.isNaN(max)) {
				return this.sendUsageError(
					message,
					this,
					`The second given value is not a valid number !`
				);
			}
		} else {
			max = min;
			min = this.DEFAULT_MIN;
		}

		if (min > max) {
			return this.sendUsageError(
				message,
				this,
				`The second argument has to be greater than the first one !`
			);
		}
		return { min, max };
	}

	private _asNumber(arg: string): number {
		return parseInt(arg, 10);
	}
}
