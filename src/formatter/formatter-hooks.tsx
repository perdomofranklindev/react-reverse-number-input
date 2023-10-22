import React, { useEffect, useState } from 'react';
import { NumberFormatterState } from './formatter-types';
import { ReverseNumberInputProps } from '../components/types';
import { NumberFormatter } from './formatter-utils';

export const useFormatterNumber = ({
	max,
	min,
	decimalScale = 0,
	enableCommaSeparator = false,
	value,
	onValueChange,
	onChange,
}: ReverseNumberInputProps): NumberFormatterState => {
	const [inputValue, setInputValue] = useState<string | undefined>(
		typeof value === 'number' ? value.toString() : value,
	);

	const { formatValue } = new NumberFormatter({
		decimalScale,
		enableCommaSeparator,
		max,
		min,
	});

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
		/**
		 * IMPORTANT: When the comma is enabled and the user is typing the apparition
		 * of each comma after the formatted move the cursor to the right, this
		 * function maintain the cursor position where the user is typing.
		 */

		if (!enableCommaSeparator) {
			return;
		}

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
	function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
		const inputElement = e.target as HTMLInputElement;
		const newValue = inputElement.value;

		// Formatted value.
		const objectFormatted = formatValue(newValue);

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

		// Adjust cursor position.
		adjustCursorPosition(
			inputElement,
			inputValue,
			objectFormatted.formattedValue,
		);
	}

	function syncFormatted(): void {
		const str = value ? value.toString() : '';
		setInputValue(formatValue(str).formattedValue);
	}

	// Sync formatted
	useEffect(() => {
		syncFormatted();
	}, [value]);

	return {
		inputValue,
		setInputValue,
		handleChange,
	};
};
