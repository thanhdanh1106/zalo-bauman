import {
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  TextField,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface StringFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  description?: string;
  helper_text?: string;
  multiline?: boolean;
}

export const StringField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  startAdornment,
  endAdornment,
  description,
  helper_text,
  multiline,
}: StringFieldProps<T>) => {
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
          <TextField
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            type="text"
            variant="outlined"
            size="small"
            multiline={multiline}
            InputProps={{
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


