import _ from "lodash";
import { LoggerService } from "../utils/logger/logger-service";
import { ILanguageKeys } from "../interfaces/language-keys-interface";

export type ITranslateKeys = {
	[key in keyof ILanguageKeys]: string;
};

export class LanguageSupport {
	private static _instance: LanguageSupport;

	public static getInstance(): LanguageSupport {
		if (_.isNil(LanguageSupport._instance))
			LanguageSupport._instance = new LanguageSupport();

		return LanguageSupport._instance;
	}

	private readonly _defaultLanguage = `en`;

	private _langJson!: ITranslateKeys;

	private _initialized = false;

	private _path = ``;

	public async init(path: string): Promise<void> {
		this._path = path;
		return this.setLang().then(() => {
			this._initialized = true;
		});
	}

	public async setLang(language?: string): Promise<void> {
		// eslint-disable-next-line no-param-reassign
		if (language === undefined) language = this._defaultLanguage;
		return import(`${this._path}/${language}`)
			.then(file => {
				this._langJson = file.default;
			})
			.catch(err => {
				const error: Error = err instanceof Error ? err : new Error(err);
				LoggerService.getInstance().error({
					context: `LanguageSupport`,
					message: `Couldn't load properly the selected language '${language}'.\n[Reason] : ${
						error.stack ? error.stack : err
					}`,
				});
			});
	}

	public lang<K extends keyof ILanguageKeys>(
		key: K,
		args?: ILanguageKeys[K]
	): string {
		if (!this._initialized) return key;
		const message = this._langJson[key];
		if (message === undefined) {
			LoggerService.getInstance().error({
				context: `LanguageSupport`,
				message: `:langs(), tried to access the key [${key}] but it dos not exist`,
			});
		}
		return this._format(message, args);
	}

	private _format(message: string, args?: { [key: string]: string }) {
		if (args === undefined) return message;
		return message.replace(/{(\w+)}/g, (match, word) => {
			return typeof args[word] !== `undefined` ? args[word] : match;
		});
	}
}
