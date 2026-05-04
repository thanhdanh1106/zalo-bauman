import { findManyCities } from '@shared/utils/Country';
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import { useController, UseControllerProps, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface CityFieldProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const CityField = ({
  name,
  control,
  label,
  required = false,
  error,
  description,
  helper_text,
}: CityFieldProps) => {
  const { t } = useTranslation();
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });

  const watchedCountryId = useWatch({
    control,
    name: 'country',
  });

  const watchedStateId = useWatch({
    control,
    name: 'state',
  });

  const [search, setSearch] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  function handleChangeData(value: string | null) {
    field.onChange(value);
  }

  async function handleFindStates(country: string, state: string) {
    try {
      setLoading(true);
      const response = await findManyCities({ country: country, state: state });
      if (response && !response.error) {
        const { data } = response;
        setOptions(data);
      }
    } catch (error) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (watchedCountryId) {
      if (watchedStateId) {
        handleFindStates(watchedCountryId, watchedStateId);
      }
    }
  }, [watchedCountryId, watchedStateId]);

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
              endAdornment: (
                <Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
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


