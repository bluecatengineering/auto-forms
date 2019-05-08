import React, {useCallback, useReducer} from 'react';
import PropTypes from 'prop-types';
import identity from 'lodash-es/identity';

import isNotNull from '../utils/isNotNull';

import FormContext from './FormContext';

const reducer = (state, {type, name, payload}) => {
	switch (type) {
		case 'SET_VALUE':
			return {...state, values: {...state.values, [name]: payload}};
		case 'SET_ERROR':
			return {...state, errors: {...state.errors, [name]: payload}};
		case 'SET_EXTRA':
			return {...state, extras: {...state.extras, [name]: payload}};
	}
	return state;
};

const getInitialState = ({initialValues, initialExtras, rules}) => ({
	initialValues,
	rules,
	values: initialValues,
	errors: {},
	extras: initialExtras,
});

const submitForm = ({rules, values, extras, initialValues}, dispatch, getActiveFields, extraValidation, onSubmit) => {
	const setError = (name, payload) => dispatch({type: 'SET_ERROR', name, payload});
	const keys = getActiveFields ? getActiveFields(values, extras) : Object.keys(values);
	const errors = keys.reduce((o, key) => {
		const rule = rules[key];
		if (rule) {
			o[key] = rule(values[key]);
		}
		return o;
	}, {});

	return Promise.resolve(extraValidation(errors, values, extras, initialValues)).then(errors => {
		const passed = Object.entries(errors).reduce(
			(r, [name, payload]) => (isNotNull(payload) ? (setError(name, payload), false) : r),
			true
		);

		if (passed) {
			const setErrors = errors => Object.entries(errors).forEach(([name, payload]) => setError(name, payload));
			onSubmit(values, {initialValues, extras, setErrors});
		}
	});
};

const Form = ({
	initialValues,
	initialExtras,
	rules,
	children,
	getActiveFields,
	extraValidation,
	onSubmit,
	...props
}) => {
	const [state, dispatch] = useReducer(reducer, {initialValues, initialExtras, rules}, getInitialState);
	const handleSubmit = useCallback(
		event => (event.preventDefault(), submitForm(state, dispatch, getActiveFields, extraValidation, onSubmit)),
		[state]
	);
	return (
		<FormContext.Provider value={{state, dispatch}}>
			<form {...props} onSubmit={handleSubmit}>
				{children}
			</form>
		</FormContext.Provider>
	);
};

Form.propTypes = {
	initialValues: PropTypes.object.isRequired,
	initialExtras: PropTypes.object,
	rules: PropTypes.object.isRequired,
	children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
	getActiveFields: PropTypes.func,
	extraValidation: PropTypes.func,
	onSubmit: PropTypes.func,
};

Form.defaultProps = {
	initialExtras: {},
	extraValidation: identity,
};

export default Form;
