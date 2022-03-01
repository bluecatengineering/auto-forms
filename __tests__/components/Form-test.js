import {useContext, useReducer, useEffect} from 'react';
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
		it('reducer sets state depending on action', () => {
			const state = {foo: 'test'};
			shallow(<Form id="test" initialValues={{}} rules={{}}>
					<div />
				</Form>)
			const reducer = useReducer.mock.calls[0][0];
			expect(reducer(state, {type: 'SET_VALUE', name: 'other', payload: 'bar'}))
				.toEqual({foo: 'test', values: {other: 'bar'}});
			expect(reducer(state, {type: 'SET_ERROR', name: 'other', payload: 'bar-error'}))
				.toEqual({foo: 'test', errors: {other: 'bar-error'}});
			expect(reducer(state, {type: 'SET_EXTRA', name: 'other', payload: 'bar-extra'}))
				.toEqual({foo: 'test', extras: {other: 'bar-extra'}});
			expect(reducer(state, {type: 'RESET', payload: {other: 'bar'}}))
				.toEqual({other: 'bar'});
			expect(reducer(state, {type: 'FAKE', name: 'fake', payload: 'fake'}))
				.toEqual(state);
		});

		it ('calls onSubmit if validation passes', () => {
			const initialValues = {test: 'foo'};
			const onSubmit = jest.fn();
			const preventDefault = jest.fn();
			const event = {preventDefault};
			const dispatch = jest.fn();
			useReducer.mockReturnValue([{errors: {}, extras: {}, initialValues, values: initialValues}, dispatch])

			const wrapper = shallow(
				<Form id="test" initialValues={initialValues} rules={{}} onSubmit={onSubmit}>
					<div />
				</Form>
			);
			return wrapper.find('#test').prop('onSubmit')(event).then(() => {
				expect(preventDefault.mock.calls).toEqual([[]]);
				expect(onSubmit.mock.calls).toEqual([[initialValues, {
					initialValues,
					extras: {},
					setErrors: expect.any(Function)
				}]]);

				const setErrors = onSubmit.mock.calls[0][1].setErrors;
				setErrors({foo: "foo-test"});
				expect(dispatch.mock.calls).toEqual([[{name: "foo", payload: "foo-test", type: "SET_ERROR"}]])
			});
		})

		it ('does not call onSubmit if the validation fails', () => {
			const onSubmit = jest.fn();
			const initialValues = {test: 'foo', other: 'bar'};
			const rule = jest.fn().mockReturnValue('rule-error');
			const getActiveFields = jest.fn().mockReturnValue(['test']);
			const extraValidation = jest.fn().mockReturnValue({foo: 'foo-error', bar: 'bar-error'});
			isNotNull.mockReturnValueOnce(true).mockReturnValueOnce(false);
			const preventDefault = jest.fn();
			const event = {preventDefault};
			const dispatch = jest.fn();
			const state = {errors: {}, extras: {}, initialValues, values: initialValues}
			useReducer.mockReturnValue([state, dispatch])
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
			return wrapper.find('#test').prop('onSubmit')(event).then(() => {
				expect(rule.mock.calls).toEqual([['foo']]);
				expect(getActiveFields.mock.calls).toEqual([[initialValues, {}]]);
				expect(extraValidation.mock.calls).toEqual([[{test: 'rule-error'}, initialValues, {}, initialValues]]);
				expect(isNotNull.mock.calls).toEqual([['foo-error'], ['bar-error']]);
				expect(onSubmit.mock.calls).toEqual([])
			});
		})

		it ('resets the form state', () => {
			const initialValues = {test: 'foo'};
			const preventDefault = jest.fn();
			const event = {preventDefault};
			const dispatch = jest.fn();
			useReducer.mockReturnValue([{test: 'bar'}, dispatch])

			const wrapper = shallow(
				<Form id="test" initialValues={initialValues} rules={{}}>
					<div />
				</Form>
			);
			wrapper.find('#test').prop('onReset')(event);
			expect(preventDefault.mock.calls).toEqual([[]]);
			expect(dispatch.mock.calls).toEqual([[{
				type: 'RESET',
				payload: {errors: {}, extras: {}, initialValues, values: initialValues}
			}]]);
		})
	});
});
