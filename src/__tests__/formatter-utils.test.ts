import { NumberFormatter } from '../formatter';

describe('Test utilities to handle the number entries', () => {
	describe('Initial number', () => {
		const numberFormatter = new NumberFormatter({
			decimalScale: 2,
		});

		it('Should be initialized with empty string', () => {
			expect(numberFormatter.initialNumber().formattedValue).toBe('0.00');
		});
	});
	describe('Should be numeric value', () => {
		const numberFormatter = new NumberFormatter();

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
	describe('Relocate the decimal point to the right place', () => {
		const numberFormatter = new NumberFormatter({
			decimalScale: 2,
		});

		it('Normalized decimal point', () => {
			expect(numberFormatter.moveDecimalPoint('10.222')).toBe('102.22');
		});
	});
});
