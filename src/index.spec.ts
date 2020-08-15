import { truthy, falsy } from './index';

describe('Index test', () => {
	test('Truthy', () => {
		expect(truthy()).toBeTruthy();
	});

	test('Falsy', () => {
		expect(falsy()).toBeFalsy();
	});
});
