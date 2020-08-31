import { LangOptions, LanguageSupport } from "../classes/language-support";

export function trans(key: string, args?: { [key: string]: string }): string {
	return LanguageSupport.getInstance().trans(key, args);
}

export default {
	init: async (path: string, options?: Partial<LangOptions>): Promise<void> =>
		LanguageSupport.getInstance().init(path, options),
	setLocale: async (language: string): Promise<void> => {
		return LanguageSupport.getInstance().setLocale(language);
	},
	trans,
};
