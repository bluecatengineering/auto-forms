# Auto-Forms

Auto-forms is a library that helps you quickly create "auto-wired" forms in React. Auto-Forms is a small library which ensures the least amount of performance hit possible, and makes it easy to create forms that already have the values, validation functions, error messages, and submit functions all work seamlessly together.


## Getting Started

```bash
npm install @bluecateng/auto-forms
```
### Creating Connected Components
#### Input
```javascript
import connect from '@bluecatend/auto-forms';
import ComponentToConnect from '...';

//Use the connect function to map the state of the component to the state of the auto-wired form:
const AutoWiredTextInput = connect(ComponentToConnect,({value, error, setValue}) => ({
		value,
		error,
		onChange: useCallback(({target: {value}}) => setValue(value), [setValue]),
	})

export default AutoWiredTextInput;

```
#### Submit
```javascript
import React from 'react';
import PropTypes from 'prop-types';
import {hasErrors} from '@bluecatend/auto-forms';

const AutoWiredSubmit =  ({...props}) => {
         //use useFromState to hook into the auto wired forms state:
         const {initialValues, values, errors} = useFormState();
         return (
             <input 
              type="submit"
              disabled={hasErrors()}
             /> 
         );
};

export default AutoWiredSubmit;

 
```
### Creating a form
```javascript
import { Form, validateNotEmpty } from "@bluecateng/auto-forms";
import { AutoWiredTextInput} from '...';
import { AutoWiredSubmit } from '...';
import { sendData } from '...';

const FormExample = () => {
   const initalValues = {
     name: 'example',
   };

   const rules= {
     'name': validateNotEmpty('Name is required'),
   };

   return (
     <Form 
      initalValues={initalValues} 
      rules={rules} 
      onSubmit={(values)=>{sendData(values.name)}}
     >
     <AutoWiredTextInput name='name' />
     <AutoWiredSubmit/>
     </Form>
   );
}

export default FormExample


```
## Documentation

`useFormField`- Returns the field by value as well as a function to edit the field outside of the input, similar to hooks in react.


`useFormState`- Returns object containing entire state of form.

`validateAnd`- Validates an array of functions, only returns null if all validations rules pass.

`validateMatches`- Validates a field against a regex pattern.

`validateNotEmpty`-Validates a field to ensure it is not empty.

`validateNotMatches`-Validates a field to ensure it does NOT match a regex pattern.

## License
[ISC](https://choosealicense.com/licenses/isc/)
