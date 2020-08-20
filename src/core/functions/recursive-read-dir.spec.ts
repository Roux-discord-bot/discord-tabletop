import { recursiveReadDir } from "./recursive-read-dir";

describe(`Recursive read dir`, () => {
	let corePath: string;

	beforeAll(() => {
		let coreReached = false;
		corePath = __dirname
			.split(`/`)
			.map(value => {
				if (coreReached) return ``;
				if (value === `core`) {
					coreReached = true;
				}
				return value;
			})
			.join(` `)
			.trim()
			.split(` `)
			.join(`/`);
		corePath = `/${corePath}`;
	});

	it(`should return array`, async () => {
		expect.assertions(0);

		const result = await recursiveReadDir(corePath);

		result.forEach(val => {
			console.log(val);
		});
	});
});
