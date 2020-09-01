import { LanguageSupport } from "../classes/language-support";
import { IDiscordConfig } from "../discord/interfaces/discord-config-interface";

export function trans(key: string, args?: { [key: string]: string }): string {
	return LanguageSupport.getInstance().trans(key, args);
}

export default {
	init: async ({ langs, locale }: IDiscordConfig): Promise<void> =>
		LanguageSupport.getInstance().init(langs, { locale }),
	setLocale: async (locale: string): Promise<void> => {
		return LanguageSupport.getInstance().setLocale(locale);
	},
	trans,
};
