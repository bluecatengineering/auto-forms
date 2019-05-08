import isNotNull from '../../src/utils/isNotNull';

jest.unmock('../../src/utils/isNotNull');

describe('isNotNull', () => {
	it('returns true if the value is not null', () => {
		expect(isNotNull('x')).toBe(true);
	});

	it('returns false if the value is null', () => {
		expect(isNotNull(null)).toBe(false);
	});

	it('returns true if the value is an array with at least a non-null item', () => {
		expect(isNotNull([null, 'x'])).toBe(true);
	});

	it('returns false if the value is an array with only null items', () => {
		expect(isNotNull([null, null])).toBe(false);
	});
});
