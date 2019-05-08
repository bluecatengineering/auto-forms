import validateNotMatches from '../../src/validation/validateNotMatches';

jest.unmock('../../src/validation/validateNotMatches');

describe('validateNotMatches', () => {
	it('returns message when value matches', () => {
		expect(validateNotMatches(/foo/, 'Test')('xfooy')).toBe('Test');
	});

	it('returns null when value does not match', () => {
		expect(validateNotMatches(/bar/, 'Test')('xfooy')).toBeNull();
	});

	it('returns null when value is empty', () => {
		expect(validateNotMatches(/bar/, 'Test')('')).toBeNull();
	});
});
