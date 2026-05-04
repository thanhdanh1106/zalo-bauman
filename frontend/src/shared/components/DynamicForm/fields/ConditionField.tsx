import {
  FormControl,
  FormHelperText,
  FormLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface ConditionFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  conditions: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const ConditionField = <T extends FieldValues>({
  name,
  control,
  label = 'Condition',
  conditions = [
    { value: 'equals', label: 'Equals' },
    { value: 'notEquals', label: 'Not Equals' },
    { value: 'greaterThan', label: 'Greater Than' },
    { value: 'lessThan', label: 'Less Than' },
  ],
  required = false,
  disabled = false,
  error,
  description,
  helper_text,
}: ConditionFieldProps<T>) => {
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
          <Select
            labelId={`${name}-label`}
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
          >
            {conditions.map((condition) => (
              <MenuItem key={condition.value} value={condition.value}>
                {condition.label}
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


