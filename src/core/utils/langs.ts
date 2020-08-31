import { LanguageSupport } from "../classes/language-support";
import { ILanguageKeys } from "../interfaces/language-keys-interface";

export function lang<K extends keyof ILanguageKeys>(
	key: K,
	args?: ILanguageKeys[K]
): string {
	return LanguageSupport.getInstance().lang(key, args);
}

export default {
	init: async (path: string): Promise<void> =>
		LanguageSupport.getInstance().init(path),
	async setLang(language: string): Promise<void> {
		return LanguageSupport.getInstance().setLang(language);
	},
	lang,
};
