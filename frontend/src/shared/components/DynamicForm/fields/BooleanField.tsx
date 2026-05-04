import InfoIcon from '@mui/icons-material/Info';
import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface BooleanFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const BooleanField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  description,
  helper_text,
}: BooleanFieldProps<T>) => {
  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value || false}
                onChange={field.onChange}
                onBlur={field.onBlur}
                disabled={disabled}
              />
            }
            label={
              <Typography>
                {`${label}${required ? ' *' : ''}`}
                {helper_text && (
                  <Tooltip title={helper_text}>
                    <InfoIcon />
                  </Tooltip>
                )}
              </Typography>
            }
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


