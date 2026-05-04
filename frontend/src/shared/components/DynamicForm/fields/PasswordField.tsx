import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface PasswordFieldProps<T extends FieldValues> {
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
}

export const PasswordField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  helper_text,
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
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
          <TextField
            value={field.value || ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            type="text"
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


