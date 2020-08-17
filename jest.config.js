// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	automock: false,
	clearMocks: true,
	resetMocks: true,
	resetModules: false,
	bail: false,
	cache: true,
	cacheDirectory: `./.cache-jest`,
	displayName: {
		color: `green`,
		name: `Test`,
	},
	verbose: true,
	roots: [`./src`],
	silent: false,
	errorOnDeprecated: true,
	setupFilesAfterEnv: [`./config.ts`],
	transform: {
		".ts": `ts-jest`,
	},
	testEnvironment: `node`,
	coverageProvider: `v8`,
	coverageReporters: [`json`, `text-summary`, `lcov`],
	collectCoverage: false,
	collectCoverageFrom: [`**/src/**/*`, `!**/node_modules/**`, `!**/vendor/**`],
	coveragePathIgnorePatterns: [`/node_modules/`],
	coverageDirectory: `coverage`,
	testPathIgnorePatterns: [`/node_modules/`],
	moduleDirectories: [`./node_modules`],
	moduleFileExtensions: [`js`, `json`, `ts`, `node`],
	globals: {
		"ts-jest": {
			compiler: `ttypescript`,
		},
	},
	preset: `ts-jest/presets/js-with-ts`,
	prettierPath: `prettier`,
	timers: `fake`, // NEVER TOUCH THIS tests aren't broken anymore thanks to this
	testTimeout: 5000,
};
