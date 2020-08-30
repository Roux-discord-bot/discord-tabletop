import { ColorResolvable } from "discord.js";
import _ from "lodash";

export interface IColors {
	DEFAULT: number;
	WHITE: number;
	AQUA: number;
	GREEN: number;
	BLUE: number;
	LIGHT_BLUE: number;
	YELLOW: number;
	PURPLE: number;
	LUMINOUS_VIVID_PINK: number;
	GOLD: number;
	ORANGE: number;
	RED: number;
	GREY: number;
	DARKER_GREY: number;
	NAVY: number;
	DARK_AQUA: number;
	DARK_GREEN: number;
	DARK_BLUE: number;
	DARK_PURPLE: number;
	DARK_VIVID_PINK: number;
	DARK_GOLD: number;
	DARK_ORANGE: number;
	DARK_RED: number;
	DARK_GREY: number;
	LIGHT_GREY: number;
	DARK_NAVY: number;
	BLURPLE: number;
	GREYPLE: number;
	DARK_BUT_NOT_BLACK: number;
	NOT_QUITE_BLACK: number;
	RANDOM: number;
}

export const Colors: IColors = {
	DEFAULT: 0x000000,
	WHITE: 0xffffff,
	AQUA: 0x1abc9c,
	GREEN: 0x2ecc71,
	BLUE: 0x3498db,
	LIGHT_BLUE: 0x00bfff,
	YELLOW: 0xffff00,
	PURPLE: 0x9b59b6,
	LUMINOUS_VIVID_PINK: 0xe91e63,
	GOLD: 0xf1c40f,
	ORANGE: 0xe67e22,
	RED: 0xe74c3c,
	GREY: 0x95a5a6,
	NAVY: 0x34495e,
	DARK_AQUA: 0x11806a,
	DARK_GREEN: 0x1f8b4c,
	DARK_BLUE: 0x206694,
	DARK_PURPLE: 0x71368a,
	DARK_VIVID_PINK: 0xad1457,
	DARK_GOLD: 0xc27c0e,
	DARK_ORANGE: 0xa84300,
	DARK_RED: 0x992d22,
	DARK_GREY: 0x979c9f,
	DARKER_GREY: 0x7f8c8d,
	LIGHT_GREY: 0xbcc0c0,
	DARK_NAVY: 0x2c3e50,
	BLURPLE: 0x7289da,
	GREYPLE: 0x99aab5,
	DARK_BUT_NOT_BLACK: 0x2c2f33,
	NOT_QUITE_BLACK: 0x23272a,
	RANDOM: Math.floor(Math.random() * (0xffffff + 1)),
};

export function resolveColor(color: keyof IColors | ColorResolvable): number {
	let result = NaN;
	if (typeof color === `string`) {
		result = Colors[color] || parseInt(color.replace(`#`, ``), 16);
	} else if (Array.isArray(color)) {
		// eslint-disable-next-line no-bitwise
		result = (color[0] << 16) + (color[1] << 8) + color[2];
	}
	if (result && _.isNaN(result)) throw new TypeError(`COLOR_CONVERT`);
	else if (result < 0 || result > 0xffffff) throw new RangeError(`COLOR_RANGE`);

	return result;
}
