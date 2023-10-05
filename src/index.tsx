import * as React from 'react';
import type { ReverseInputNumberProps } from './types';

/**
 * @author Franklin Perdomo <perdomofranklindev@gmail.com>
 * @description - Reverse input number component.
 * @param {ReverseInputNumberProps} root0 - Props.
 * @param {number} root0.max - Max.
 * @param {number} root0.min - Min.
 * @param {number} root0.decimalScale - Decimal scale.
 * @param {boolean} root0.enableCommaSeparator - EnableCommaSeparator.
 * @param {string | number} root0.value - Value.
 * @param {Function} root0.onValueChange - On value change.
 * @param {Function} root0.onChange - On change.
 * @param {React.HTMLInputTypeAttribute} root0.type - Type.
 * @returns {React.ReactElement} - React element.
 */
export const ReverseInputNumber = ({
  max,
  min,
  decimalScale = 2,
  enableCommaSeparator,
  value = '',
  onValueChange,
  onChange,
  type = 'text',
  ...props
}: ReverseInputNumberProps): React.ReactElement => {
  // State to hold the input value
  const [inputValue, setInputValue] = React.useState<string>(
    typeof value === 'number' ? value.toString() : value,
  ); // Initialize with provided value

  /**
   * @description - Format value.
   * @param {string} valueWithDecimal - Value with decimal.
   * @returns {string} - Format value.
   */
  const formatValue = (valueWithDecimal: string): string => {
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

  /**
   * @description - Handle value change.
   * @param {string} formattedValue - Formatted value.
   * @returns {void} - Nothing.
   */
  const handleValueChange = (formattedValue: string): void => {
    if (onValueChange) {
      onValueChange({
        formattedValue,
        value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
          decimalScale || 0,
        ),
        floatValue: parseFloat(formattedValue.replace(/,/g, '')),
      });
    }
  };

  /**
   * @description - Handle empty value.
   * @returns {void} - Nothing.
   */
  const handleEmptyValue = (): void => {
    const zeroValue = `0${decimalScale ? '.' : ''}${
      decimalScale ? '0'.repeat(decimalScale || 0) : ''
    }`;
    setInputValue(zeroValue);
    handleValueChange(zeroValue);
  };

  /**
   * @description - Update value.
   * @param newValue - New value.
   * @returns {void} - Nothing.
   */
  const updateValue = (newValue: string): void => {
    if (newValue === '') {
      handleEmptyValue();
      return;
    }

    const typedValue = newValue.replace(/[^\d-]/g, '');
    const valueArray = typedValue.split('');

    if (typeof decimalScale === 'number' && valueArray.length >= decimalScale) {
      valueArray.splice(valueArray.length - decimalScale, 0, '.');
    }

    const valueWithDecimal = valueArray.join('');
    const formattedValue = formatValue(valueWithDecimal);

    setInputValue(formattedValue);
    handleValueChange(formattedValue);
  };

  /**
   * @description - Handle change.
   * @param {React.ChangeEvent<HTMLInputElement>} e - React.ChangeEvent<HTMLInputElement>.
   * @returns {void} - Nothing.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    updateValue(newValue);

    if (onChange) {
      onChange(e);
    }
  };

  React.useEffect(() => {
    updateValue(value.toString());
  }, []);

  return (
    <input type={type} value={inputValue} onChange={handleChange} {...props} />
  );
};
