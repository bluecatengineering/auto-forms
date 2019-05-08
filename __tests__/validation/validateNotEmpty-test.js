import validateNotEmpty from '../../src/validation/validateNotEmpty';

jest.unmock('../../src/validation/validateNotEmpty');

describe('validateNotEmpty', () => {
	it('returns message when value is empty', () => {
		expect(validateNotEmpty('Test')(' ')).toBe('Test');
	});

	it('returns null when value is not empty', () => {
		expect(validateNotEmpty('Test')('x')).toBeNull();
	});
});
