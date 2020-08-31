import { LanguageSupport } from "../classes/language-support";

export function lang(key: string, args?: { [key: string]: string }): string {
	return LanguageSupport.getInstance().lang(key, args);
}

export default {
	init: async (path: string, languages?: string): Promise<void> =>
		LanguageSupport.getInstance().init(path, languages),
	async setLang(language: string): Promise<void> {
		return LanguageSupport.getInstance().setLang(language);
	},
	lang,
};
