import { LanguageSupport } from "../classes/language-support";

export function trans(key: string, args?: { [key: string]: string }): string {
	return LanguageSupport.getInstance().trans(key, args);
}

export default {
	init: async (langs: string, locale?: string): Promise<void> =>
		LanguageSupport.getInstance().init(langs, { locale }),
	setLocale: async (locale: string): Promise<void> => {
		return LanguageSupport.getInstance().setLocale(locale);
	},
	trans,
};
