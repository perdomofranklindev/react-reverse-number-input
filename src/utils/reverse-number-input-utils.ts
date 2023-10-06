/**
 * @description - Get only number.
 * @param value - Value.
 * @returns {string} - Number string.
 */
export const getOnlyNumber = (value: string): string =>
	value.replace(/[^\d-]/g, '');

/**
 * @description - To initialize the number.
 * @param decimalScale - Decimal scale.
 * @returns {string} - Initialized number.
 */
export const initializeTheNumber = (decimalScale: number): string =>
	`0${decimalScale ? '.' : ''}${
		decimalScale ? '0'.repeat(decimalScale || 0) : ''
	}`;
