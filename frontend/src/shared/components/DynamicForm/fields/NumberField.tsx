import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  TextField as MuiTextField,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface NumberFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  description?: string;
  helper_text?: string;
}

export const NumberField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  min,
  max,
  step = 0.01,
  startAdornment,
  endAdornment,
  description,
  helper_text,
}: NumberFieldProps<T>) => {
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
          <MuiTextField
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            type="number"
            variant="outlined"
            size="small"
            InputProps={{
              inputProps: {
                min,
                max,
                step,
              },
              startAdornment: startAdornment ? (
                <InputAdornment position="start">
                  {startAdornment}
                </InputAdornment>
              ) : undefined,
              endAdornment: endAdornment ? (
                <InputAdornment position="end">{endAdornment}</InputAdornment>
              ) : undefined,
            }}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


