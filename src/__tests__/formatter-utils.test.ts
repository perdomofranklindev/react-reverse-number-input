/* eslint-disable */
import { NumberFormatter } from '../formatter';

describe('Test utilities to handle the number entries', () => {
	describe('Value initialization', () => {
		const numberFormatter = new NumberFormatter({
			decimalScale: 2,
		});

		it('Should be initialized with empty string', () => {
			expect(numberFormatter.initialNumber().formattedValue).toBe('0.00');
		});
	});
	describe('Should be numeric values', () => {
		const numberFormatter = new NumberFormatter({});

		it('Alphanumeric values should be numeric', () => {
			expect(numberFormatter.sanitizedNumber('12A')).toBe('12');
			expect(numberFormatter.sanitizedNumber('B12')).toBe('12');
		});
		it('Numerical units symbols values should numeric', () => {
			expect(numberFormatter.sanitizedNumber('15.000')).toBe('15.000');
			expect(numberFormatter.sanitizedNumber('3..000')).toBe('3.000');
			expect(numberFormatter.sanitizedNumber('+100')).toBe('100');
		});
		it('Negative numbers should be numeric', () => {
			expect(numberFormatter.sanitizedNumber('-15.000')).toBe('-15.000');
		});
	});
	// describe('Number formatted', () => {
	// 	it('Should return a formatted number', () => {
	// 		expect(
	// 			formatValue({
	// 				valueWithDecimal: '150200',
	// 				decimalScale: 2,
	// 			}),
	// 		).toBe('150,200.00');
	// 	});
	// });
});
