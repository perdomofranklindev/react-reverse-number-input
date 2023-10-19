import { FormattedOutputObject } from './formatter-types';

/**
 * @description - Get only number.
 * @param value - Value.
 * @returns {string} - Number string.
 */
export const getOnlyNumber = (value: string): string =>
	value.replace(/[^\d-]/g, '');

/**
 * @description - To initialize the number.
 * @param {number | undefined} decimalScale - Decimal scale.
 * @returns {string} - Initialized number.
 */
export const initializeTheNumber = (decimalScale?: number): string =>
	`0${decimalScale ? '.' : ''}${
		decimalScale ? '0'.repeat(decimalScale || 0) : ''
	}`;

/**
 * @description - Format value.
 * @param {*} valueWithDecimal - Value with decimal.
 * @returns {string} - Format value.
 */
export const formatValue = ({
	valueWithDecimal,
	decimalScale,
	enableCommaSeparator,
	max,
	min,
}: {
	valueWithDecimal: string;
	decimalScale: number;
	enableCommaSeparator?: boolean;
	max?: number;
	min?: number;
}): string => {
	const formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimalScale || 0,
		maximumFractionDigits: decimalScale || 0,
		useGrouping: enableCommaSeparator,
	});

	let formattedValue = formatter.format(parseFloat(valueWithDecimal));

	if (max !== undefined && parseFloat(valueWithDecimal) > max) {
		formattedValue = formatter.format(max);
	}

	if (min !== undefined && parseFloat(valueWithDecimal) < min) {
		formattedValue = formatter.format(min);
	}

	return formattedValue;
};

// --------------------------------
// Refactor.
// --------------------------------

export function initialNumber(decimalScale: number): FormattedOutputObject {
	const zeroValue = `0${decimalScale ? '.' : ''}${
		decimalScale ? '0'.repeat(decimalScale || 0) : ''
	}`;
	return {
		formattedValue: zeroValue,
		value: '0',
		floatValue: 0,
	};
}

// eslint-disable-next-line
export function sanitizedNumber(num: string): string {
	// Remove all non-numeric characters
	const typedValue = num.replace(/[^\d.-]/g, '');

	// Remove all decimal points after the first
	const firstDecimalPointIndex = typedValue.indexOf('.');
	if (firstDecimalPointIndex !== -1) {
		return (
			typedValue.substring(0, firstDecimalPointIndex + 1) +
			typedValue.substring(firstDecimalPointIndex + 1).replace(/\./g, '')
		);
	}

	return typedValue;
}

/**
 * @description - Relocate decimal point.
 * @param {object} params - Params.
 * @param {string} params.str - String.
 * @param {number} params.decimalScale - Decimal scale.
 * @returns {string} - String.
 */
export function moveDecimalPoint({
	str,
	decimalScale,
}: {
	str: string;
	decimalScale: number;
}): string {
	// If it's doesn't have point return early.
	if (!str.includes('.')) {
		return str;
	}

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

export function prepareIntlFormatter({
	decimalScale,
	enableCommaSeparator,
}: {
	decimalScale: number;
	enableCommaSeparator?: boolean;
}): Intl.NumberFormat {
	// Format the value with commas for thousands and the correct number of decimal places
	const formatter = new Intl.NumberFormat('en-US', {
		minimumFractionDigits: decimalScale || 0,
		maximumFractionDigits: decimalScale || 0,
		useGrouping: enableCommaSeparator,
	});

	return formatter;
}

/**
 * @description - Format value.
 * @param {string} newValue - New value.
 * @returns {FormattedOutputObject} - Object formatted.
 */
export function formatValueRefactored({
	newValue,
	decimalScale,
	enableCommaSeparator,
	max,
	min,
}: {
	newValue: string;
	decimalScale: number;
	enableCommaSeparator: boolean;
	max?: number;
	min?: number;
}): FormattedOutputObject {
	// If input is empty, set everything to zero
	if (newValue === '') {
		return initialNumber(decimalScale);
	}

	// Validate and remove all non-numeric characters
	let typedValue = sanitizedNumber(newValue);
	// Move the decimal point to the correct position
	typedValue = moveDecimalPoint({ str: typedValue, decimalScale });

	const formatter = prepareIntlFormatter({
		decimalScale,
		enableCommaSeparator,
	});
	let formattedValue = formatter.format(parseFloat(typedValue));

	// If there's a specified maximum value, enforce it
	if (max !== undefined && parseFloat(typedValue) > max) {
		formattedValue = formatter.format(max);
	}

	// If there's a specified minimum value, enforce it
	if (min !== undefined && parseFloat(typedValue) < min) {
		formattedValue = formatter.format(min);
	}

	return {
		formattedValue,
		value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
			decimalScale || 0,
		),
		floatValue: parseFloat(formattedValue.replace(/,/g, '')),
	};
}
