import {useContext} from 'react';

import useFormState from '../../src/components/useFormState';
import isNotNull from '../../src/utils/isNotNull';

jest.unmock('../../src/components/useFormState');

jest.mock('react', () => ({
	...jest.requireActual('react'),
	useContext: jest.fn(),
}));

describe('useFormState', () => {
	it('returns an object with expected fields', () => {
		const initialValues = {test: 'test-initial'};
		const values = {test: 'test-value'};
		const errors = {test: 'test-error'};
		const extras = {test: 'test-extra'};
		const submit = jest.fn();
		useContext.mockReturnValue({state: {initialValues, values, errors, extras}, submit});

		const state = useFormState();
		expect(state).toEqual({
			initialValues,
			values,
			errors,
			extras,
			submit,
			isChanged: expect.any(Function),
			hasErrors: expect.any(Function),
		});

		expect(state.isChanged()).toBe(true);

		isNotNull.mockReturnValue(true);
		expect(state.hasErrors()).toBe(true);
	});
});
