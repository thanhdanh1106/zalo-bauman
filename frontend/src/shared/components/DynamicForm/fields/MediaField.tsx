import { Button, FormControl, FormHelperText, InputLabel } from '@mui/material';
import { useRef } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface MediaFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  accept?: string;
  description?: string;
  helper_text?: string;
}

export const MediaField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  accept = 'image/*',
  description,
  helper_text,
}: MediaFieldProps<T>) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: File | null) => void
  ) => {
    const file = event.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      {label && (
        <InputLabel shrink htmlFor={name}>
          {label} {required && '*'}
        </InputLabel>
      )}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <input
              type="file"
              accept={accept}
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={(e) => handleFileChange(e, field.onChange)}
              onBlur={field.onBlur}
              disabled={disabled}
            />
            <Button
              variant="contained"
              component="span"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              sx={{ mt: 2 }}
            >
              Upload Media
            </Button>
            {field.value && <p>Selected File: {(field.value as File).name}</p>}
          </>
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


