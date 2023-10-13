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
