import MultiplePostPicker from '@shared/components/MultiplePostPicker';
import SelectedCell from '@shared/components/SelectedCell';
import { PickerProps } from '@/types/picker';
import { FormControl, FormLabel } from '@mui/material';
import { useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Apis } from '../picker.apis';

interface MultiplePostPickerProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  error?: string[] | null;
  model: keyof typeof Apis;
  optionKey?: string;
  previewKey?: string | null;
  description?: string;
  helper_text?: string;
}

export const MultiplePostPickerField = ({
  name,
  control,
  label,
  model,
  required = false,
  error,
  description,
  helper_text,
  optionKey = 'title',
  previewKey = null,
}: MultiplePostPickerProps) => {
  const { t } = useTranslation();
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });

  const handleChange = (value: PickerProps[] | null) => {
    if (value?.length) {
      const currentValues: PickerProps[] = field.value || [];
      const merged = [...currentValues, ...value];
      const uniqueById = Array.from(
        new Map(merged.map((item) => [item.id, item])).values()
      );
      field.onChange(uniqueById);
    }
  };

  const handleRemove = (id: number) => {
    const currentValues: { id: number }[] = field.value || [];
    const filteredValues = currentValues.filter((item) => item?.id != id);
    field.onChange(filteredValues);
  };

  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    const currentValues: { id: number }[] = field.value || [];

    if (
      dragIndex === hoverIndex ||
      dragIndex < 0 ||
      hoverIndex < 0 ||
      dragIndex >= currentValues.length ||
      hoverIndex >= currentValues.length
    ) {
      return;
    }

    const updated = [...currentValues];

    const [movedItem] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, movedItem);

    field.onChange(updated);
  };

  return (
    <FormControl
      sx={{ width: '100%', mb: 3 }}
      error={Boolean(error)}
      required={required}
    >
      <FormLabel>
        {label}
        <span className="text-sm ml-2">
          ({Array.isArray(field.value) ? field.value?.length : 0})
        </span>
      </FormLabel>
      <SelectedCell
        data={field.value}
        onClear={(id: number) => handleRemove(id)}
        display_key="title"
        onReorder={handleReorder}
      />
      <MultiplePostPicker
        label={label || t('Post Categories')}
        name={name}
        error={error || null}
        getApi={Apis[model]?.findMany}
        values={field.value}
        onChange={handleChange}
        optionKey={optionKey}
        labelStyle={{ mb: 1, fontSize: 14 }}
        valueKey="id"
        previewKey={previewKey}
      />
    </FormControl>
  );
};


