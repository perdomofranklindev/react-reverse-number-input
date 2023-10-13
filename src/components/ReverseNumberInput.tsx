import React from 'react';
import { useFormatterNumber } from '../formatter';
import { ReverseNumberInputProps } from './types';
/**
 * @author Franklin Perdomo <perdomofranklindev@gmail.com>
 * @description - Reverse input number component.
 * @param {ReverseNumberInputProps} root0 - Props.
 * @param {number} root0.max - Max.
 * @param {number} root0.min - Min.
 * @param {number} root0.decimalScale - Decimal scale.
 * @param {boolean} root0.enableCommaSeparator - EnableCommaSeparator.
 * @param {string | number} root0.value - Value.
 * @param {Function} root0.onValueChange - On value change.
 * @param {Function} root0.onChange - On change.
 * @param {React.HTMLInputTypeAttribute} root0.type - Type.
 * @returns {JSX.Element} - React element.
 */
export const ReverseNumberInput: React.FC<ReverseNumberInputProps> = (
	props,
): JSX.Element => {
	const { inputValue, handleChange } = useFormatterNumber(props);
	return <input value={inputValue} onChange={handleChange} {...props} />;
};
