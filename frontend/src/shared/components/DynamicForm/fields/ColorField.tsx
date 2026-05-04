import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { MuiColorInput } from 'mui-color-input';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface ColorFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  multiline?: boolean;
  rows?: number;
  description?: string;
  helper_text?: string;
}

export const ColorField = <T extends FieldValues>({
  name,
  control,
  label,
  type = 'text',
  required = false,
  disabled = false,
  error,
  multiline = false,
  rows = 1,
  description,
  helper_text,
}: ColorFieldProps<T>) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <FormLabel htmlFor={`${name}-label`}>
        {label ? label : ''}{' '}
        {required ? <span className="text-red-600">*</span> : ''}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <MuiColorInput
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            format="hex"
            rows={rows}
            size="small"
            variant="outlined"
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


