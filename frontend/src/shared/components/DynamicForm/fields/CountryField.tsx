import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import Countries from '@shared/utils/countries.json';

interface CountryProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const CountryField = ({
  name,
  control,
  label,
  required = false,
  error,
  description,
  helper_text,
}: CountryProps) => {
  const { t } = useTranslation();
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });

  const [search, setSearch] = useState('');

  const [options, setOptions] = useState<string[]>(
    Countries.map((val) => val.name)
  );

  function handleChangeData(value: string) {
    field.onChange(value);
  }

  return (
    <FormControl
      sx={{ width: '100%', mb: 3 }}
      error={Boolean(error)}
      required={required}
    >
      <FormLabel htmlFor={`${name}-label`}>
        {label ? label : ''}{' '}
        {required ? <span className="text-red-600">*</span> : ''}
      </FormLabel>
      <Autocomplete
        id="combo-box-demo"
        size="small"
        options={options}
        defaultValue={field.value}
        getOptionLabel={(option: string) => option}
        getOptionKey={(option: string) => option}
        onChange={(e: React.SyntheticEvent, value: any) => {
          handleChangeData(value);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            InputProps={{
              ...params.InputProps,
            }}
          />
        )}
        renderOption={(props, option) => (
          <Box
            component="li"
            sx={{
              display: 'flex',
              py: 1,
              gap: 1,
            }}
            {...props}
          >
            <Box className="flex gap-3 items-center">{option}</Box>
          </Box>
        )}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


