import React, { useState } from 'react';
import {
	formatValue,
	getOnlyNumber,
	initializeTheNumber,
} from '../utils/reverse-number-input-utils';
import { ReverseNumberInputProps } from '../types/reverse-number-input';

interface FormatterNumberReturns {
	inputValue: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useFormatterNumber = ({
	max,
	min,
	decimalScale = 2,
	enableCommaSeparator,
	value = '',
	onValueChange,
	onChange,
}: ReverseNumberInputProps): FormatterNumberReturns => {
	// State to hold the input value
	const [inputValue, setInputValue] = useState<string>(
		typeof value === 'number' ? value.toString() : value,
	); // Initialize with provided value

	/**
	 * @description - Handle value change.
	 * @param {string} formattedValue - Formatted value.
	 * @returns {void} - Nothing.
	 */
	const handleValueChange = (formattedValue: string): void => {
		if (onValueChange) {
			onValueChange({
				formattedValue,
				value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
					decimalScale || 0,
				),
				floatValue: parseFloat(formattedValue.replace(/,/g, '')),
			});
		}
	};

	/**
	 * @description - Handle empty value.
	 * @returns {void} - Nothing.
	 */
	const handleEmptyValue = (): void => {
		const zeroValue = initializeTheNumber(decimalScale);
		setInputValue(zeroValue);
		handleValueChange(zeroValue);
	};

	/**
	 * @description - Update value.
	 * @param newValue - New value.
	 * @returns {void} - Nothing.
	 */
	const updateValue = (newValue: string): void => {
		// Early return for empty values.
		if (newValue === '') {
			handleEmptyValue();
			return;
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
		handleValueChange(formattedValue);
	};

	/**
	 * @description - Handle change.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - React.ChangeEvent<HTMLInputElement>.
	 * @returns {void} - Nothing.
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const newValue = e.target.value;
		updateValue(newValue);

		if (onChange) {
			onChange(e);
		}
	};

	React.useEffect(() => {
		updateValue(value.toString());
	}, []);

	return {
		inputValue,
		setInputValue,
		handleChange,
	};
};
