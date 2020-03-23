import React, {useContext, useEffect} from 'react';
import {render} from 'react-dom';
import {act} from 'react-dom/test-utils';
import {shallow} from 'enzyme';

import Form from '../../src/components/Form';
import isNotNull from '../../src/utils/isNotNull';
import FormContext from '../../src/components/FormContext';

jest.unmock('../../src/components/Form');

const Test = () => {
	const {state, dispatch} = useContext(FormContext);
	useEffect(() => {
		if (state.values.test === 'foo') {
			dispatch({type: 'SET_VALUE', name: 'test', payload: 'new-value'});
			dispatch({type: 'SET_EXTRA', name: 'test', payload: 'new-extra'});
			dispatch({type: 'OTHER', name: 'test', payload: 'new-other'});
		}
	});
	return <div />;
};

describe('Form', () => {
	describe('rendering', () => {
		it('renders expected elements', () => {
			const wrapper = shallow(
				<Form id="test" initialValues={{test: 'foo'}} rules={{}}>
					<div />
				</Form>
			);
			expect(wrapper.getElement()).toMatchSnapshot();
		});
	});

	describe('behaviour', () => {
		it('calls onSubmit if the validation passes', () =>
			new Promise((resolve) => {
				const initialValues = {test: 'foo'};
				const preventDefault = jest.spyOn(Event.prototype, 'preventDefault');

				const onSubmit = jest.fn().mockImplementation((values, {setErrors}) => {
					expect(preventDefault).toHaveBeenCalledTimes(1);
					expect(onSubmit.mock.calls).toEqual([
						[
							{test: 'new-value'},
							{
								initialValues,
								extras: {test: 'new-extra'},
								setErrors: expect.any(Function),
							},
						],
					]);

					act(() => {
						setErrors({foo: 'foo-error', bar: 'bar-error'});
					});

					resolve();
				});

				const container = document.createElement('div');
				act(() => {
					render(
						<Form id="test" initialValues={initialValues} rules={{}} onSubmit={onSubmit}>
							<Test />
						</Form>,
						container
					);
				});

				const form = container.querySelector('#test');
				form.dispatchEvent(new Event('submit'));
			}));

		it('does not call onSubmit if the validation fails', () => {
			const onSubmit = jest.fn();
			const initialValues = {test: 'foo', other: 'bar'};
			const rule = jest.fn().mockReturnValue('rule-error');
			const getActiveFields = jest.fn().mockReturnValue(['test']);
			const extraValidation = jest.fn().mockReturnValue({foo: 'foo-error', bar: 'bar-error'});
			const event = {preventDefault: jest.fn()};
			const wrapper = shallow(
				<Form
					id="test"
					initialValues={initialValues}
					rules={{test: rule}}
					getActiveFields={getActiveFields}
					extraValidation={extraValidation}
					onSubmit={onSubmit}
				/>
			);
			const handleSubmit = wrapper.find('#test').prop('onSubmit');
			isNotNull.mockReturnValueOnce(true).mockReturnValueOnce(false);
			return handleSubmit(event).then(() => {
				expect(rule.mock.calls).toEqual([['foo']]);
				expect(getActiveFields.mock.calls).toEqual([[initialValues, {}]]);
				expect(extraValidation.mock.calls).toEqual([[{test: 'rule-error'}, initialValues, {}, initialValues]]);
				expect(isNotNull.mock.calls).toEqual([['foo-error'], ['bar-error']]);
				expect(onSubmit).not.toHaveBeenCalled();
			});
		});
	});
});
