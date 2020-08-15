// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
	clearMocks: true,
	displayName: {
		color: 'green',
		name: 'Test',
	},
	verbose: true,
	roots: ['./src'],
	silent: true,
	errorOnDeprecated: true,
	transform: {
		'.ts': 'ts-jest',
	},
	testEnvironment: 'node',
	coverageProvider: 'v8',
	coverageReporters: ['json', 'text-summary', 'lcov'],
	collectCoverage: true,
	collectCoverageFrom: ['**/src/**/*', '!**/node_modules/**', '!**/vendor/**'],
	coveragePathIgnorePatterns: ['/node_modules/'],
	coverageDirectory: 'coverage',
	testPathIgnorePatterns: ['/node_modules/'],
	moduleDirectories: ['./node_modules'],
	moduleFileExtensions: ['js', 'json', 'ts', 'node'],
	globals: {
		'ts-jest': {
			compiler: 'ttypescript',
		},
	},
	preset: 'ts-jest/presets/js-with-ts',
	prettierPath: 'prettier',
};
