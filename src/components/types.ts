import { FormattedOutputObject } from '../formatter';

export interface ReverseNumberInputProps
	extends React.DetailedHTMLProps<
		React.InputHTMLAttributes<HTMLInputElement>,
		HTMLInputElement
	> {
	max?: number;
	min?: number;
	decimalScale?: number;
	enableCommaSeparator?: boolean;
	value?: string | number;
	onValueChange?: (valueObject: FormattedOutputObject) => void;
	onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}
