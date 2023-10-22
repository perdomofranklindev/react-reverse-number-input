import { FormattedOutputObject } from './formatter-types';

interface NumberFormatterProps {
	decimalScale?: number;
	enableCommaSeparator?: boolean;
	max?: number;
	min?: number;
}

export class NumberFormatter {
	decimalScale: number;
	enableCommaSeparator: boolean;
	max: number;
	min: number;

	constructor({
		decimalScale,
		enableCommaSeparator,
		max,
		min,
	}: NumberFormatterProps) {
		this.decimalScale = Number(decimalScale);
		this.enableCommaSeparator = Boolean(enableCommaSeparator);
		this.max = Number(max);
		this.min = Number(min);
	}

	/**
	 * @description - Function to return the initial value of the input.
	 * @returns {FormattedOutputObject} - Initial value of the input.
	 */
	initialNumber(): FormattedOutputObject {
		const zeroValue = `0${this.decimalScale ? '.' : ''}${
			this.decimalScale ? '0'.repeat(this.decimalScale || 0) : ''
		}`;
		return {
			formattedValue: zeroValue,
			value: '0',
			floatValue: 0,
		};
	}

	/**
	 * @description - Function to sanitize the number.
	 * @param {string} num - Num.
	 * @returns {string} - Sanitized number.
	 */
	// eslint-disable-next-line
	sanitizedNumber(num: string): string {
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
	 * @description - Function to move the decimal point.
	 * @param str - String to move the decimal point.
	 * @returns {string} - String with the decimal point moved.
	 */
	moveDecimalPoint(str: string): string {
		// If it's doesn't have point return early.
		if (!str.includes('.')) {
			return str;
		}

		// Remove the decimal point from the string
		const wholePart = str.split('.')[0];
		let fractionalPart = str.split('.')[1];

		// Check if the fractional part length is less than, equal to or greater than the decimalScale
		if (fractionalPart.length < this.decimalScale) {
			// If it's less, add zeros at the end
			let diff = this.decimalScale - fractionalPart.length;
			while (diff > 0) {
				fractionalPart += '0';
				diff--;
			}
		}

		if (fractionalPart.length > this.decimalScale) {
			// If it's more, move the decimal point
			let newNumber = wholePart + fractionalPart;

			// Insert the decimal point at the right position
			const decimalPointIndex = newNumber.length - this.decimalScale;
			newNumber = `${newNumber.slice(0, decimalPointIndex)}.${newNumber.slice(
				decimalPointIndex,
			)}`;

			return newNumber;
		}

		// If the fractional part length is equal to the decimalScale, return the number as it is
		return str;
	}

	/**
	 * @description - Function to prepare the Intl formatter.
	 * @returns {Intl.NumberFormat} - Instance.
	 */
	prepareIntlFormatter(): Intl.NumberFormat {
		const formatter = new Intl.NumberFormat('en-US', {
			minimumFractionDigits: this.decimalScale || 0,
			maximumFractionDigits: this.decimalScale || 0,
			useGrouping: this.enableCommaSeparator,
		});
		return formatter;
	}

	/**
	 * @description - Function to format the value.
	 * @param {string} newValue - New value.
	 * @returns {FormattedOutputObject} - Formatted value.
	 */
	formatValue(newValue: string): FormattedOutputObject {
		if (newValue === '') {
			return this.initialNumber();
		}

		let typedValue = this.sanitizedNumber(newValue);
		typedValue = this.moveDecimalPoint(typedValue);

		const formatter = this.prepareIntlFormatter();
		let formattedValue = formatter.format(parseFloat(typedValue));

		if (this.max && parseFloat(typedValue) > this.max) {
			formattedValue = formatter.format(this.max);
		}

		if (this.min && parseFloat(typedValue) < this.min) {
			formattedValue = formatter.format(this.min);
		}

		return {
			formattedValue,
			value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
				this.decimalScale || 0,
			),
			floatValue: parseFloat(formattedValue.replace(/,/g, '')),
		};
	}
}
