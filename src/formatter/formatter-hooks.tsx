import React, { useEffect, useState } from 'react';
import { FormattedOutputObject, NumberFormatterState } from './formatter-types';
import { ReverseNumberInputProps } from '../components/types';
import { initializeTheNumber } from './formatter-utils';

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
	 * @description - Function to handle empty value.
	 * @returns {FormattedOutputObject} - Object formatted.
	 */
	function handleEmptyValue(): FormattedOutputObject {
		const zeroValue = initializeTheNumber(decimalScale);
		setInputValue(zeroValue);
		return {
			formattedValue: zeroValue,
			value: '0',
			floatValue: 0,
		};
	}

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
	 * @description - Function to prepare the formatter.
	 * @returns {Intl.NumberFormat} - Formatter.
	 */
	function prepareIntlFormatter(): Intl.NumberFormat {
		// Format the value with commas for thousands and the correct number of decimal places
		const formatter = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: decimalScale || 0,
			maximumFractionDigits: decimalScale || 0,
			useGrouping: enableCommaSeparator,
		});

		return formatter;
	}

	/**
	 * @description - Relocate decimal point.
	 * @param {string} str - String.
	 * @returns {string} - String.
	 */
	function moveDecimalPoint(str: string): string {
		// Remove the decimal point from the string
		const wholePart = str.split('.')[0];
		let fractionalPart = str.split('.')[1];

		// Check if the fractional part length is less than, equal to or greater than the decimalScale
		if (fractionalPart.length < decimalScale) {
			// If it's less, add zeros at the end
			let diff = decimalScale - fractionalPart.length;
			while (diff > 0) {
				fractionalPart += '0';
				diff--;
			}
		}

		if (fractionalPart.length > decimalScale) {
			// If it's more, move the decimal point
			let newNumber = wholePart + fractionalPart;

			// Insert the decimal point at the right position
			const decimalPointIndex = newNumber.length - decimalScale;
			newNumber = `${newNumber.slice(0, decimalPointIndex)}.${newNumber.slice(
				decimalPointIndex,
			)}`;

			return newNumber;
		}

		// If the fractional part length is equal to the decimalScale, return the number as it is
		return str;
	}

	/**
	 * @description - Format value.
	 * @param {string} newValue - New value.
	 * @returns {FormattedOutputObject} - Object formatted.
	 */
	function formatValue(newValue: string): FormattedOutputObject {
		// If input is empty, set everything to zero
		if (newValue === '') {
			return handleEmptyValue();
		}

		let typedValue = newValue.replace(/[^\d.-]/g, '');

		// Remove all decimal points after the first
		const firstDecimalPointIndex = typedValue.indexOf('.');
		if (firstDecimalPointIndex !== -1) {
			typedValue =
				typedValue.substring(0, firstDecimalPointIndex + 1) +
				typedValue.substring(firstDecimalPointIndex + 1).replace(/\./g, '');
		}

		if (typedValue.includes('.')) {
			typedValue = moveDecimalPoint(typedValue);
		}

		const formatter = prepareIntlFormatter();
		let formattedValue = formatter.format(parseFloat(typedValue));

		// If there's a specified maximum value, enforce it
		if (max !== undefined && parseFloat(typedValue) > max) {
			formattedValue = formatter.format(max);
		}

		// If there's a specified minimum value, enforce it
		if (min !== undefined && parseFloat(typedValue) < min) {
			formattedValue = formatter.format(min);
		}

		setInputValue(formattedValue);

		return {
			formattedValue,
			value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
				decimalScale || 0,
			),
			floatValue: parseFloat(formattedValue.replace(/,/g, '')),
		};
	}

	/**
	 * @description - Handle change.
	 * @param {React.ChangeEvent<HTMLInputElement>} e - React.ChangeEvent<HTMLInputElement>.
	 * @returns {void} - Nothing.
	 */
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const inputElement = e.target as HTMLInputElement;
		const newValue = inputElement.value;

		const objectFormatted = formatValue(newValue);

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
