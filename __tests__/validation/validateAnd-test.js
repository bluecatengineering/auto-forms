import validateAnd from '../../src/validation/validateAnd';

jest.unmock('../../src/validation/validateAnd');

describe('validateAnd', () => {
	it('returns the message from the first rule which fails', () => {
		const rule1 = jest.fn();
		const rule2 = jest.fn().mockReturnValue('Test');
		expect(validateAnd([rule1, rule2])('x')).toBe('Test');
		expect(rule1.mock.calls).toEqual([['x']]);
		expect(rule2.mock.calls).toEqual([['x']]);
	});

	it('returns null if rules return null', () => {
		const rule1 = jest.fn();
		const rule2 = jest.fn();
		expect(validateAnd([rule1, rule2])('x')).toBeNull();
		expect(rule1.mock.calls).toEqual([['x']]);
		expect(rule2.mock.calls).toEqual([['x']]);
	});
});
