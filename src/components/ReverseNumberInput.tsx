import React from 'react';
import { useFormatterNumber } from '../formatter';
import { ReverseNumberInputProps } from './types';
/**
 * @author Franklin Perdomo <perdomofranklindev@gmail.com>
 * @description - Reverse input number component.
 * @param {ReverseNumberInputProps} props - Props.
 * @param {number} props.max - Max.
 * @param {number} props.min - Min.
 * @param {number} props.decimalScale - Decimal scale.
 * @param {boolean} props.enableCommaSeparator - EnableCommaSeparator.
 * @param {string | number} props.value - Value.
 * @param {Function} props.onValueChange - On value change.
 * @param {Function} props.onChange - On change.
 * @param {React.HTMLInputTypeAttribute} props.type - Type.
 * @returns {JSX.Element} - React element.
 */
export const ReverseNumberInput: React.FC<ReverseNumberInputProps> = (
	props,
): JSX.Element => {
	const { inputValue, handleChange } = useFormatterNumber(props);
	return <input value={inputValue} onChange={handleChange} placeholder='this is a chance' {...props}  />;
};
