import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface DateTimeProps<T extends FieldValues> {
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

export const DateTimeField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  description,
  helper_text,
}: DateTimeProps<T>) => {
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
          <DateTimePicker
            value={dayjs(field.value) || dayjs()}
            onChange={field.onChange}
            disabled={disabled}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


