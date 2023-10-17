import React, { useState } from 'react';
import { FormattedOutputObject, NumberFormatterState } from './formatter-types';
import { ReverseNumberInputProps } from '../components/types';
import {
	adjustCursorPosition,
	formatValue,
	getOnlyNumber,
	initializeTheNumber,
} from './formatter-utils';

export const useFormatterNumber = ({
	max,
	min,
	decimalScale = 0,
	enableCommaSeparator = false,
	value,
	onValueChange,
	onChange,
}: ReverseNumberInputProps): NumberFormatterState => {
	// State to hold the input value
	const [inputValue, setInputValue] = useState<string | undefined>(
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
	const updateValue = (newValue: string | undefined): FormattedOutputObject => {
		// Early return for empty values.
		if (newValue === '' || newValue === undefined) {
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
		const inputElement = e.target as HTMLInputElement;
		const newValue = e.target.value;

		const objectFormatted = updateValue(newValue);

		if (onValueChange) {
			onValueChange(objectFormatted);
		}

		// Consistent value in the native event onChange.
		if (onChange) {
			onChange({
				...e,
				target: { ...e.target, value: objectFormatted.value },
			});
		}

		if (enableCommaSeparator) {
			const { selectionStart, selectionEnd } = adjustCursorPosition({
				inputSelection: {
					selectionStart: inputElement.selectionStart,
					selectionEnd: inputElement.selectionEnd,
				},
				previousValue: inputValue || '',
				currentValue: newValue,
			});
			requestAnimationFrame(() => {
				inputElement.setSelectionRange(selectionStart, selectionEnd);
			});
		}
	};

	React.useEffect(() => {
		updateValue(value ? value.toString() : '');
	}, [value]);

	return {
		inputValue,
		setInputValue,
		handleChange,
	};
};
