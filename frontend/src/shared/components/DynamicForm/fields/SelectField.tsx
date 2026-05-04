import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface SelectFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  options: { value: string | number; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const SelectField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  required = false,
  disabled = false,
  error,
  description,
  helper_text,
}: SelectFieldProps<T>) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      {label && (
        <FormLabel id={`${name}-label`}>
          {label} {required ? <span className="text-red-600">*</span> : ''}
        </FormLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            labelId={`${name}-label`}
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            size="small"
          >
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


