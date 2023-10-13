export interface FormattedOutputObject {
	formattedValue: string;
	value: string;
	floatValue: number;
}

// Hook returning.
export interface NumberFormatterState {
	inputValue: string;
	setInputValue: React.Dispatch<React.SetStateAction<string>>;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
