import { recursiveReadDir } from "./recursive-read-dir";

describe(`Recursive read dir`, () => {
	describe(`when given path is valid`, () => {
		let validPath: string;

		beforeAll(() => {
			const last = __dirname.lastIndexOf(`/`);
			validPath = __dirname.substring(0, last);
		});

		it(`should return an array`, () => {
			expect.assertions(1);

			const result = recursiveReadDir(validPath);

			expect(result).toStrictEqual(expect.any(Array));
		});

		it(`should NOT throw an Error`, () => {
			expect.assertions(0);

			try {
				recursiveReadDir(validPath);
			} catch (err) {
				fail();
			}
		});
	});

	describe(`when given path is invalid`, () => {
		it(`should throw an Error`, () => {
			expect.assertions(1);

			try {
				recursiveReadDir(`invalid-path`);
			} catch (err) {
				expect(err).toStrictEqual(expect.any(Error));
			}
		});
	});
});
