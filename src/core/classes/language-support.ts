import _ from "lodash";
import { LoggerService } from "../utils/logger/logger-service";

export class LanguageSupport {
	private static _instance: LanguageSupport;

	public static getInstance(): LanguageSupport {
		if (_.isNil(LanguageSupport._instance))
			LanguageSupport._instance = new LanguageSupport();

		return LanguageSupport._instance;
	}

	private readonly _defaultLanguage = `en`;

	private _langJson: { [key: string]: string } = {};

	private _initialized = false;

	private _path = ``;

	/**
	 *
	 * @param path The absolute path to the folder where the .json are
	 * @param languages The language to translate to.
	 * "en" if nothing's specified
	 */
	public async init(path: string, languages?: string): Promise<void> {
		this._path = path;
		return this.setLang(languages).then(() => {
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

	public lang(key: string, args?: { [key: string]: string }): string {
		if (!this._initialized) return key;
		const message = this._langJson[key];
		if (message === undefined) {
			LoggerService.getInstance().error({
				context: `LanguageSupport`,
				message: `:langs(), tried to access the key [${key}] but it does not exist`,
			});
		}
		return this._format(message, args);
	}

	private _format(message: string, args?: { [key: string]: string }) {
		if (args === undefined) return message;
		return message.replace(/\${(\w+)}/g, (match, word) => {
			return typeof args[word] !== `undefined` ? args[word] : match;
		});
	}
}
