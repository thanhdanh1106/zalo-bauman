import ThumbnailPicker from '@shared/components/ThumbnailPicker';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { Controller, UseControllerProps } from 'react-hook-form';

interface ThumbnailFieldProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  multiple?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

const ThumbnailField = ({
  name,
  control,
  label,
  required = false,
  multiple,
  error,
  description,
  helper_text,
}: ThumbnailFieldProps) => {
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
          <ThumbnailPicker
            error={!!error}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};

export default ThumbnailField;


