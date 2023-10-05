export interface ReverseInputNumberProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  max?: number;
  min?: number;
  decimalScale?: number;
  enableCommaSeparator?: boolean;
  value?: string | number;
  onValueChange?: (valueObject: {
    formattedValue: string;
    value: string;
    floatValue: number;
  }) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}
