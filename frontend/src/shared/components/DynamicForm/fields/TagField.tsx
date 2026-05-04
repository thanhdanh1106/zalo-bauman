import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  TextField,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { MdClose } from 'react-icons/md';

interface TagFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const TagField = <T extends FieldValues>({
  name,
  control,
  label = 'Tags',
  required = false,
  disabled = false,
  error,
  description,
  helper_text,
}: TagFieldProps<T>) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Autocomplete
            multiple
            freeSolo
            fullWidth
            options={[]}
            value={field.value || []}
            size="small"
            onChange={(_, newValue) => {
              field.onChange(newValue);
            }}
            disabled={disabled}
            renderTags={(value, getTagProps) =>
              Array.isArray(value) &&
              value.length &&
              value.map((option, index) => (
                <Chip
                  key={index}
                  label={option}
                  deleteIcon={<MdClose />}
                  onDelete={getTagProps({ index }).onDelete}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                inputRef={params.InputProps?.ref}
                fullWidth
                size="small"
                label={`${label}${required ? ' *' : ''}`}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


