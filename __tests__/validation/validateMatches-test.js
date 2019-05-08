import validateMatches from '../../src/validation/validateMatches';

jest.unmock('../../src/validation/validateMatches');

describe('validateMatches', () => {
	it('returns message when value does not match', () => {
		expect(validateMatches(/bar/, 'Test')('xfooy')).toBe('Test');
	});

	it('returns null when value matches', () => {
		expect(validateMatches(/foo/, 'Test')('xfooy')).toBeNull();
	});

	it('returns null when value is empty', () => {
		expect(validateMatches(/foo/, 'Test')('')).toBeNull();
	});
});
