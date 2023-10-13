import React, { useState } from 'react';
import { FormattedOutputObject } from './formatter-types';
import { formatValue, getOnlyNumber, initializeTheNumber } from './formatter-utils';
import { ReverseNumberInputProps } from '../components/types';

interface FormatterNumberReturns {
	inputValue: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useFormatterNumber = ({
	max,
	min,
	decimalScale = 0,
	enableCommaSeparator = false,
	value = '',
	onValueChange,
	onChange,
}: ReverseNumberInputProps): FormatterNumberReturns => {
	// State to hold the input value
	const [inputValue, setInputValue] = useState<string>(
		typeof value === 'number' ? value.toString() : value,
	); // Initialize with provided value

	/**
	 * @description - Handle empty value.
	 * @returns {void} - Nothing.
	 */
	const handleEmptyValue = (): FormattedOutputObject => {
		const zeroValue = initializeTheNumber(decimalScale);
		return {
			formattedValue: zeroValue,
			value: '0',
			floatValue: 0,
		};
	};

	/**
	 * @description - Update value.
	 * @param newValue - New value.
	 * @returns {void} - Nothing.
	 */
	const updateValue = (newValue: string): FormattedOutputObject => {
		// Early return for empty values.
		if (newValue === '') {
			return handleEmptyValue();
		}

		const typedValue = getOnlyNumber(newValue); // Transform and validate the typed number.
		const valueArray = typedValue.split(''); // Split the string into an array.

		if (typeof decimalScale === 'number' && valueArray.length >= decimalScale) {
			valueArray.splice(valueArray.length - decimalScale, 0, '.');
		}

		const valueWithDecimal = valueArray.join('');
		const formattedValue = formatValue({
			valueWithDecimal,
			decimalScale,
			enableCommaSeparator,
			max,
			min,
		});

		setInputValue(formattedValue);

		return {
			formattedValue,
			value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
				decimalScale || 0,
			),
			floatValue: parseFloat(formattedValue.replace(/,/g, '')),
		};
	};

	/**
	 * @description - Handle change.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - React.ChangeEvent<HTMLInputElement>.
	 * @returns {void} - Nothing.
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newValue = e.target.value;

		const objectFormatted = updateValue(newValue);

		if (onValueChange) {
			onValueChange(objectFormatted);
		}

		if (onChange) {
			// Consistent value in the native event onChange.
			onChange({
				...e,
				target: { ...e.target, value: objectFormatted.value },
			});
		}
	};

	React.useEffect(() => {
		updateValue(value.toString());
	}, [value]);

	return {
		inputValue,
		setInputValue,
		handleChange,
	};
};
