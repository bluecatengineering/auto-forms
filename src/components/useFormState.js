import {useContext} from 'react';
import isEqual from 'lodash-es/isEqual';

import isNotNull from '../utils/isNotNull';

import FormContext from './FormContext';

export default () => {
	const {
		state: {initialValues, values, errors, extras},
		submit,
		reset,
	} = useContext(FormContext);
	return {
		initialValues,
		values,
		errors,
		extras,
		submit,
		reset,
		isChanged: () => !isEqual(initialValues, values),
		hasErrors: () => Object.values(errors).some(isNotNull),
	};
};
