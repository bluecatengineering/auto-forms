import {useContext} from 'react';

import useFormField from '../../src/components/useFormField';

jest.unmock('../../src/components/useFormField');

describe('useFormField', () => {
	it('returns an object with expected fields', () => {
		const rule = jest.fn().mockReturnValue('rule-error');
		const dispatch = jest.fn();
		const values = {test: 'test-value'};
		const rules = {test: rule};
		const errors = {test: 'test-error'};
		const extras = {test: 'test-extra'};
		useContext.mockReturnValue({state: {values, errors, extras}, dispatch, rules});

		const data = useFormField('test');
		expect(data).toEqual({
			value: 'test-value',
			error: 'test-error',
			extra: 'test-extra',
			setValue: expect.any(Function),
			setError: expect.any(Function),
			setExtra: expect.any(Function),
		});

		data.setValue('new-value');
		data.setError('new-error');
		data.setExtra('new-extra');
		expect(dispatch.mock.calls).toEqual([
			[{type: 'SET_VALUE', name: 'test', payload: 'new-value'}],
			[{type: 'SET_ERROR', name: 'test', payload: 'rule-error'}],
			[{type: 'SET_ERROR', name: 'test', payload: 'new-error'}],
			[{type: 'SET_EXTRA', name: 'test', payload: 'new-extra'}],
		]);
		expect(rule.mock.calls).toEqual([['new-value']]);
	});

	it('ignores missing rules', () => {
		const dispatch = jest.fn();
		useContext.mockReturnValue({state: {values: {}, errors: {}, extras: {}}, dispatch, rules: {}});

		const data = useFormField('test');
		data.setValue('new-value');
		expect(dispatch.mock.calls).toEqual([[{type: 'SET_VALUE', name: 'test', payload: 'new-value'}]]);
	});
});
