import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField as MuiTextField,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import slugify from 'slugify';

interface SlugFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  value: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: boolean | string;
  description?: string;
  helper_text?: string;
}

export const SlugField = <T extends FieldValues>({
  name,
  value,
  control,
  label = 'Slug',
  required = false,
  disabled = false,
  description,
  helper_text,
  error,
}: SlugFieldProps<T>) => {
  const handleSlugChange = (value: string) => {
    return slugify(value, {
      lower: true,
      locale: 'vi',
    });
  };

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
            onChange={(e) => {
              const formattedValue = handleSlugChange(e.target.value);
              field.onChange(formattedValue);
            }}
            onBlur={field.onBlur}
            disabled={disabled}
            variant="outlined"
            placeholder="example-slug"
            size="small"
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


