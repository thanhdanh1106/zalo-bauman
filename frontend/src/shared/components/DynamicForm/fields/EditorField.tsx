import RichTextEditorComponent from '@shared/components/RichTextEditorComponent';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface EditorFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const EditorField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  description,
  helper_text,
}: EditorFieldProps<T>) => {
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
          <RichTextEditorComponent
            value={field.value}
            setValue={field.onChange}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


