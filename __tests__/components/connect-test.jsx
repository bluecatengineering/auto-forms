import React from 'react';
import {shallow} from 'enzyme';

import connect from '../../src/components/connect';
import useFormField from '../../src/components/useFormField';

jest.unmock('../../src/components/connect');

describe('connect', () => {
	it('returns a component which maps state', () => {
		const C = (...props) => <div {...props} />;
		const W = connect(
			C,
			({foo}) => ({bar: foo})
		);
		useFormField.mockReturnValue({foo: 'x'});
		const wrapper = shallow(<W id="test" name="bar" />);
		expect(wrapper.getElement()).toMatchSnapshot();
		expect(useFormField.mock.calls).toEqual([['bar']]);
	});
});
