import * as React from 'react';
import { ReverseInputNumberProps } from './types';

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
}: ReverseInputNumberProps) => {
  // State to hold the input value
  const [inputValue, setInputValue] = React.useState<string>(
    typeof value === 'number' ? value.toString() : value,
  ); // Initialize with provided value

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

  const handleValueChange = (formattedValue: string): void => {
    if (onValueChange) {
      onValueChange({
        formattedValue: formattedValue,
        value: parseFloat(formattedValue.replace(/,/g, '')).toFixed(
          decimalScale || 0,
        ),
        floatValue: parseFloat(formattedValue.replace(/,/g, '')),
      });
    }
  };

  const handleEmptyValue = (): void => {
    const zeroValue = `0${decimalScale ? '.' : ''}${
      decimalScale ? '0'.repeat(decimalScale || 0) : ''
    }`;
    setInputValue(zeroValue);
    handleValueChange(zeroValue);
  };

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
