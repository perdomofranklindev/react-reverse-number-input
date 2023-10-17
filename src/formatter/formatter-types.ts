export interface FormattedOutputObject {
	formattedValue: string;
	value: string;
	floatValue: number;
}

// Hook returning.
export interface NumberFormatterState {
	inputValue: string | undefined;
	setInputValue: React.Dispatch<React.SetStateAction<string | undefined>>;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
