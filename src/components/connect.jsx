import React, {useMemo} from 'react';
import PropTypes from 'prop-types';

import useFormField from './useFormField';

export default (Component, mapState) => {
	const Wrapper = ({name, ...props}) => {
		const state = useFormField(name);
		const newProps = {...props, ...mapState(state)};
		// eslint-disable-next-line react-hooks/exhaustive-deps
		return useMemo(() => <Component {...newProps} />, Object.values(newProps));
	};
	Wrapper.displayName = 'Form(' + (Component.displayName || Component.name) + ')';
	Wrapper.propTypes = {
		name: PropTypes.string.isRequired,
	};
	return Wrapper;
};
