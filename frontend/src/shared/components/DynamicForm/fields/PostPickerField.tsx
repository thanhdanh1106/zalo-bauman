import PostPicker from '@shared/components/PostPicker';
import { postProps } from '@/types/post';
import { userProps } from '@/types/user';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Apis } from '../picker.apis';

interface PostPickerFieldProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  error?: string[] | null;
  model: keyof typeof Apis;
  description?: string;
  optionKey?: string;
  previewKey?: string | null;
  helper_text?: string;
}

export const PostPickerField = ({
  name,
  control,
  label,
  model,
  required = false,
  error,
  optionKey = 'title',
  previewKey = null,
  description,
  helper_text,
}: PostPickerFieldProps) => {
  const { t } = useTranslation();
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });

  type PickerProps = postProps & userProps;

  const handleChange = (value: PickerProps | null) => {
    field.onChange(value);
  };

  return (
    <FormControl fullWidth margin="normal" error={Boolean(error)}>
      <FormLabel htmlFor={`${name}-label`}>
        {label ? label : ''}{' '}
        {required ? <span className="text-red-600">*</span> : ''}
      </FormLabel>
      <PostPicker
        name={name}
        error={error || null}
        getApi={Apis[model].findMany}
        defaultData={field.value}
        onChange={handleChange}
        valueKey="id"
        optionKey={optionKey}
        previewKey={previewKey}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};


