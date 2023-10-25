/* eslint-disabled */
import React, { useState } from 'react';
import { ReverseNumberInput } from 'react-reverse-number-input';

const App = () => {
	const [value, setValue] = useState('0.00');
	return (
		<div>
			<ReverseNumberInput
				value={value}
				onValueChange={e => {
					setValue(e.formattedValue);
				}}
				decimalScale={4}
				enableCommaSeparator
			/>
		</div>
	);
};

export default App;
