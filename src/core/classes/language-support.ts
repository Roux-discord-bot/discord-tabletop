import _ from "lodash";
import fs from "fs";
import { LoggerService } from "../utils/logger/logger-service";
import { UnknownObject } from "../utils/constants";

export const DEFAULT_LANGUAGE = `en`;

export class LanguageSupport {
	private static _instance: LanguageSupport;

	public static getInstance(): LanguageSupport {
		if (_.isNil(LanguageSupport._instance))
			LanguageSupport._instance = new LanguageSupport();

		return LanguageSupport._instance;
	}

	private _language = DEFAULT_LANGUAGE;

	private _langJson: UnknownObject = {};

	private _initialized = false;

	private _path = ``;

	/**
	 *
	 * @param path The absolute path to the folder where the .json are
	 * @param lang The language to translate to.
	 * "en" if nothing's specified
	 */
	public async init(path: string, lang?: string): Promise<void> {
		this._path = path;
		return this.setLang(lang).then(() => {
			this._initialized = true;
		});
	}

	public async setLang(lang?: string): Promise<void> {
		// eslint-disable-next-line no-param-reassign
		const language = lang !== undefined ? lang : DEFAULT_LANGUAGE;
		return import(`${this._path}/${language}`)
			.then(file => {
				this._langJson = file.default;
				this._language = language;
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

	public lang(key: string, args?: UnknownObject): string {
		if (!this._initialized) return key;
		const message = this._langJson[key];
		if (message === undefined) {
			this._langJson[key] = key;
			this._saveLangJson();
			return key;
		}
		return this._format(message, args);
	}

	private _saveLangJson() {
		fs.writeFile(
			`${this._path}/${this._language}.json`,
			JSON.stringify(this._langJson, undefined, 2),
			err => {
				if (err) {
					LoggerService.getInstance().error({
						context: `LanguageSupport`,
						message: `:langs(), an error occured when writing the file to add a key, \n${err}`,
					});
				}
			}
		);
	}

	private _format(message: string, args?: UnknownObject) {
		if (args === undefined) return message;
		return message.replace(/\${(\w+)}/g, (match, word) => {
			return typeof args[word] !== `undefined` ? args[word] : match;
		});
	}
}
