import React, { useEffect, useState } from 'react';
import { NumberFormatterState } from './formatter-types';
import { ReverseNumberInputProps } from '../components/types';
import { formatValueRefactored } from './formatter-utils';

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
	 * @description - Function to adjust the cursor position in the input.
	 * @param {HTMLInputElement} inputElement - Input element.
	 * @param {string} previousValue - Previous value.
	 * @param {string} currentValue - Current value.
	 * @returns {void} - Nothing.
	 */
	function adjustCursorPosition(
		inputElement: HTMLInputElement,
		previousValue: string | undefined,
		currentValue: string,
	): void {
		let selectionStart = Number(inputElement.selectionStart);
		let selectionEnd = Number(inputElement.selectionEnd);

		// Check if a new comma was added
		const previousCommaCount = (previousValue?.match(/,/g) || []).length;
		const currentCommaCount = (currentValue.match(/,/g) || []).length;
		if (currentCommaCount > previousCommaCount) {
			selectionStart += 1;
			selectionEnd += 1;
		}

		// Restore the cursor position
		requestAnimationFrame(() => {
			inputElement.setSelectionRange(selectionStart, selectionEnd);
		});
	}

	/**
	 * @description - Handle change.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - React.ChangeEvent<HTMLInputElement>.
	 * @returns {void} - Nothing.
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const inputElement = e.target as HTMLInputElement;
		const newValue = inputElement.value;

		// Formatted value.
		const objectFormatted = formatValueRefactored({
			newValue,
			max,
			min,
			decimalScale,
			enableCommaSeparator,
		});

		setInputValue(objectFormatted.formattedValue); // Update state.

		// Callback onValueChange.
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
			adjustCursorPosition(
				inputElement,
				inputValue,
				objectFormatted.formattedValue,
			);
		}
	};

	// Sync formatted
	useEffect(() => {
		const stringValue = value ? value.toString() : '';
		formatValue(stringValue);
	}, [value]);

	return {
		inputValue,
		setInputValue,
		handleChange,
	};
};
