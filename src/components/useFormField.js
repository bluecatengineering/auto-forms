import {useCallback, useContext} from 'react';

import FormContext from './FormContext';

export default (name) => {
	const {state, dispatch} = useContext(FormContext);
	const value = state.values[name];
	const rule = state.rules[name];
	const error = state.errors[name];
	const extra = state.extras[name];
	const setValue = useCallback(
		(value) => {
			dispatch({type: 'SET_VALUE', name, payload: value});
			if (rule) {
				dispatch({type: 'SET_ERROR', name, payload: rule(value)});
			}
		},
		[name, rule, dispatch]
	);

	const setError = useCallback((payload) => dispatch({type: 'SET_ERROR', name, payload}), [name, dispatch]);

	const setExtra = useCallback((payload) => dispatch({type: 'SET_EXTRA', name, payload}), [name, dispatch]);

	return {value, error, extra, setValue, setError, setExtra};
};
