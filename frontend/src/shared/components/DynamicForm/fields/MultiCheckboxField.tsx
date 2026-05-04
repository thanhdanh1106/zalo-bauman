import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
} from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface MultiCheckboxFieldProps<T extends FieldValues> {
    name: Path<T>;
    control: Control<T>;
    label?: string;
    options: { value: string | number; label: string }[];
    required?: boolean;
    disabled?: boolean;
    error?: string;
    helper_text?: string;
}

export const MultiCheckboxField = <T extends FieldValues>({
    name,
    control,
    label,
    options,
    required = false,
    disabled = false,
    error,
    helper_text,
}: MultiCheckboxFieldProps<T>) => {
    return (
        <FormControl
            component="fieldset"
            fullWidth
            margin="normal"
            error={!!error}
        >
            {label && (
                <FormLabel component="legend">
                    {label}{" "}
                    {required ? <span className="text-red-600">*</span> : ""}
                </FormLabel>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field }) => {
                    const { value = [], onChange } = field;

                    const handleChange = (optionValue: string | number) => {
                        const currentValue = [...(value || [])];
                        const index = currentValue.indexOf(optionValue);
                        if (index === -1) {
                            currentValue.push(optionValue);
                        } else {
                            currentValue.splice(index, 1);
                        }
                        onChange(currentValue);
                    };

                    return (
                        <FormGroup>
                            {options.map((option) => (
                                <FormControlLabel
                                    key={option.value}
                                    control={
                                        <Checkbox
                                            checked={value?.includes(
                                                option.value,
                                            )}
                                            onChange={() =>
                                                handleChange(option.value)
                                            }
                                            disabled={disabled}
                                        />
                                    }
                                    label={option.label}
                                />
                            ))}
                        </FormGroup>
                    );
                }}
            />

            {error && <FormHelperText>{error}</FormHelperText>}
            {helper_text && !error && (
                <FormHelperText>{helper_text}</FormHelperText>
            )}
        </FormControl>
    );
};


