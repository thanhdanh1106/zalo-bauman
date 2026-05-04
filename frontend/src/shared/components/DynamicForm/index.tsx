import { LoadingButton } from '@mui/lab';
import { Box, Grid } from '@mui/material';
import { useEffect, useMemo } from 'react';
import {
  Controller,
  FieldValues,
  SubmitErrorHandler,
  SubmitHandler,
  useForm,
  useWatch,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToasterContext } from '../ToasterContext';
import SeoDisplay from './components/SeoDisplay';
import { BooleanField } from './fields/BooleanField';
import { ColorField } from './fields/ColorField';
import { DateField } from './fields/DateField';
import { DateTimeField } from './fields/DateTimeField';
import { EditorField } from './fields/EditorField';
import { GalleryField } from './fields/GalleryField';
import { GroupField } from './fields/GroupField';
import { LocationField } from './fields/LocationField';
import { MultiCheckboxField } from './fields/MultiCheckboxField';
import { MultiplePostPickerField } from './fields/MultiplePostPickerField';
import { NumberField } from './fields/NumberField';
import { PasswordField } from './fields/PasswordField';
import { PostPickerField } from './fields/PostPickerField';
import { RepeaterField } from './fields/RepeaterField';
import { SelectField } from './fields/SelectField';
import { SlugField } from './fields/SlugField';
import { StringField } from './fields/StringField';
import { TagField } from './fields/TagField';
import { TextAreaField } from './fields/TextAreaField';
import ThumbnailField from './fields/ThumbnailField';
import { YoutubeField } from './fields/YoutubeField';
import { VariantsField } from './fields/VariantsField';

export interface FieldCondition {
  field: string; // Tên field cần kiểm tra
  operator:
    | '==='
    | '!='
    | '>'
    | '<'
    | '>='
    | '<='
    | 'includes'
    | 'not_includes'
    | 'in'
    | 'not_in'
    | 'empty'
    | 'not_empty';
  value?: any; // Giá trị so sánh
  values?: any[]; // Mảng giá trị cho operator 'in' hoặc 'not_in'
}

export interface FieldConditionGroup {
  logic: 'AND' | 'OR'; // Logic kết hợp các điều kiện
  conditions: (FieldCondition | FieldConditionGroup)[]; // Có thể nest các nhóm điều kiện
}

export interface FormField {
  name: string;
  label: string;
  type: string;
  description?: string;
  input?: string;
  helper_text?: string;
  size?: number;
  rules?: {
    required?: boolean | string;
    [key: string]: any;
  };
  disabled?: boolean;
  defaultParams?: Record<string, any>;
  defaultValue?: string;
  rows?: number;
  previewKey?: string | null;
  optionKey?: string;
  category?: string;
  model?: string;
  inputType?: string;
  min?: number;
  max?: number;
  step?: number;
  startAdornment?: string;
  endAdornment?: string;
  multiple?: boolean;
  options?: { value: string | number; label: string }[];
  fields?: { name: string; label: string; type: string }[];
  props?: Record<string, any>;
  condition?: FieldCondition | FieldConditionGroup; // Điều kiện hiển thị field
}

interface FormSchema {
  title?: string;
  display_title?: string;
  fields: FormField[];
}

interface DynamicFormProps {
  showNav?: boolean;
  showSeo?: boolean;
  schema: FormSchema;
  showTitle?: boolean;
  onSubmit: (data: FieldValues) => void;
  onChange?: (data: FieldValues) => void;
  defaultValues?: FieldValues;
  isLoading?: boolean;
  submitLabel?: string;
}

const DynamicForm = ({
  showNav = true,
  showSeo = true,
  schema,
  showTitle,
  onChange,
  onSubmit,
  defaultValues = {},
  isLoading = false,
  submitLabel = 'Submit',
}: DynamicFormProps) => {
  const { t } = useTranslation();
  const { showMessage } = useToasterContext();
  const initValue = useMemo(() => {
    return coerceDefaultValues(schema.fields, defaultValues);
  }, [schema.fields, defaultValues]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: initValue,
  });

  const watchedValues = useWatch({
    control,
  });

  useEffect(() => {
    if (onChange && watchedValues) {
      onChange(watchedValues);
    }
  }, [watchedValues, onChange]);

  // Utility function để đánh giá một điều kiện đơn lẻ
  function evaluateCondition(
    condition: FieldCondition,
    formValues: FieldValues
  ): boolean {
    const fieldValue = formValues[condition.field];

    switch (condition.operator) {
      case '===':
        return fieldValue === condition.value;
      case '!=':
        return fieldValue !== condition.value;
      case '>':
        return Number(fieldValue) > Number(condition.value);
      case '<':
        return Number(fieldValue) < Number(condition.value);
      case '>=':
        return Number(fieldValue) >= Number(condition.value);
      case '<=':
        return Number(fieldValue) <= Number(condition.value);
      case 'includes':
        if (Array.isArray(fieldValue)) {
          return fieldValue.includes(condition.value);
        }
        return String(fieldValue).includes(String(condition.value));
      case 'not_includes':
        if (Array.isArray(fieldValue)) {
          return !fieldValue.includes(condition.value);
        }
        return !String(fieldValue).includes(String(condition.value));
      case 'in':
        return condition.values ? condition.values.includes(fieldValue) : false;
      case 'not_in':
        return condition.values ? !condition.values.includes(fieldValue) : true;
      case 'empty':
        if (Array.isArray(fieldValue)) return fieldValue.length === 0;
        if (typeof fieldValue === 'object' && fieldValue !== null) {
          return Object.keys(fieldValue).length === 0;
        }
        return !fieldValue || fieldValue === '';
      case 'not_empty':
        if (Array.isArray(fieldValue)) return fieldValue.length > 0;
        if (typeof fieldValue === 'object' && fieldValue !== null) {
          return Object.keys(fieldValue).length > 0;
        }
        return fieldValue && fieldValue !== '';
      default:
        return false;
    }
  }

  // Utility function để đánh giá nhóm điều kiện
  function evaluateConditionGroup(
    conditionGroup: FieldConditionGroup,
    formValues: FieldValues
  ): boolean {
    const results = conditionGroup.conditions.map((condition) => {
      if ('logic' in condition) {
        // Đây là một FieldConditionGroup nested
        return evaluateConditionGroup(
          condition as FieldConditionGroup,
          formValues
        );
      } else {
        // Đây là một FieldCondition
        return evaluateCondition(condition as FieldCondition, formValues);
      }
    });

    if (conditionGroup.logic === 'AND') {
      return results.every((result) => result);
    } else {
      return results.some((result) => result);
    }
  }

  // Function chính để kiểm tra điều kiện hiển thị field
  function shouldShowField(field: FormField, formValues: FieldValues): boolean {
    if (!field.condition) return true;

    if ('logic' in field.condition) {
      // Đây là một FieldConditionGroup
      return evaluateConditionGroup(
        field.condition as FieldConditionGroup,
        formValues
      );
    } else {
      // Đây là một FieldCondition đơn lẻ
      return evaluateCondition(field.condition as FieldCondition, formValues);
    }
  }

  function cleanText(str: string): string {
    return str
      .trim()
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function coerceDefaultValues(
    schema: FormField[],
    input: Record<string, any>
  ): Record<string, any> {
    const output: Record<string, any> = {};

    for (const field of schema) {
      const value = input?.[field.name];
      if (field.type === 'group' && Array.isArray(field.fields)) {
        const nestedInput =
          typeof value === 'object' && value !== null ? value : {};
        output[field.name] = coerceDefaultValues(field.fields, nestedInput);
      } else if (field.type === 'repeater' && Array.isArray(field.fields)) {
        if (!Array.isArray(value)) {
          output[field.name] = [];
        } else {
          output[field.name] = value.map((item) => {
            const nestedInput =
              typeof item === 'object' && item !== null ? item : {};
            return coerceDefaultValues(field.fields!, nestedInput);
          });
        }
      } else {
        output[field.name] = coerceValue(field.type, value);
      }
    }

    return output;
  }

  function coerceValue(type: string, value: any): any {
    if (value === undefined || value === null) return getDefaultByType(type);
    switch (type) {
      case 'text':
        return cleanText(String(value));
      case 'textarea':
        return cleanText(String(value));
      case 'tag':
        if (Array.isArray(value)) return value.map((v) => cleanText(String(v)));
        if (typeof value === 'string')
          return value.split(',').map((v) => cleanText(v));
        return [];
      case 'group':
        return typeof value === 'object' ? value : {};
      case 'repeater':
        return typeof value === 'object' ? value : [];
      default:
        return value;
    }
  }

  function getDefaultByType(type: string): any {
    switch (type) {
      case 'text':
      case 'textarea':
        return '';
      case 'tag':
        return [];
      case 'thumbnail':
        return null;
      case 'group':
        return {};
      case 'repeater':
        return [];
      default:
        return '';
    }
  }

  const checkForSubmit: SubmitHandler<FieldValues> = (data) => {
    onSubmit(data);
  };

  const onError: SubmitErrorHandler<FieldValues> = (errors) => {
    if (errors) {
      for (const key in errors) {
        if (Object.prototype.hasOwnProperty.call(errors, key)) {
          const element = errors[key];
          showMessage(
            'error',
            String(element?.message) || 'One or many field input invalid!'
          );
        }
      }
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(checkForSubmit, onError)}
      sx={{ width: '100%' }}
    >
      <Box className="">
        {showTitle ? (
          schema?.title ? (
            <h1 className="text-3xl font-bold mb-5">{schema?.title}</h1>
          ) : (
            <Controller
              name={schema?.display_title || 'title'}
              control={control}
              render={({ field: { value } }) => (
                <h1 className="text-3xl font-bold mb-5">
                  {value || 'Untitled'}
                </h1>
              )}
            />
          )
        ) : (
          ''
        )}
        <Grid className="!text-sm" container columnSpacing={3}>
          {schema.fields.map((field, index) => {
            // Kiểm tra điều kiện hiển thị field
            const isVisible = shouldShowField(field, watchedValues || {});

            if (!isVisible) {
              return null; // Ẩn field nếu không thỏa mãn điều kiện
            }

            return (
              <Grid item key={index} xs={12} lg={field?.size}>
                {renderField(field, control, errors, watchedValues || {})}
              </Grid>
            );
          })}
        </Grid>
        {showSeo && (
          <Box sx={{ mt: 3 }}>
            <SeoDisplay control={control} />
          </Box>
        )}
        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          loading={isLoading}
          sx={{ mt: 2 }}
        >
          {t(submitLabel)}
        </LoadingButton>
      </Box>
    </Box>
  );
};

export const renderField = (
  field: FormField,
  control: any,
  errors: any,
  formValues?: FieldValues
) => {
  switch (field.type) {
    case 'text':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <StringField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              startAdornment={field.startAdornment}
              endAdornment={field.endAdornment}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'youtube':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <YoutubeField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              startAdornment={field.startAdornment}
              endAdornment={field.endAdornment}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'password':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <PasswordField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              startAdornment={field.startAdornment}
              endAdornment={field.endAdornment}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'textarea':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <TextAreaField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              startAdornment={field.startAdornment}
              endAdornment={field.endAdornment}
              multiline={true}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'variants':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <VariantsField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              startAdornment={field.startAdornment}
              endAdornment={field.endAdornment}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'richText':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <EditorField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'thumbnail':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <ThumbnailField
              name={field.name}
              control={control}
              label={field.label}
              multiple={field.multiple}
              rules={field.rules}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'gallery':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <GalleryField
              name={field.name}
              control={control}
              label={field.label}
              multiple={field.multiple}
              rules={field.rules}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'post_picker':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <PostPickerField
              name={field.name}
              control={control}
              model={(field?.model as 'posts' | 'post_categories') || 'posts'}
              label={field.label}
              rules={field.rules}
              required={field.rules?.required as boolean}
              previewKey={field.previewKey}
              optionKey={field.optionKey}
              error={
                errors[field.name]?.message
                  ? [errors[field.name]?.message as string]
                  : null
              }
            />
          )}
        />
      );
    case 'multiple_post_picker':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <MultiplePostPickerField
              name={field.name}
              control={control}
              model={(field?.model as 'posts' | 'post_categories') || 'posts'}
              label={field.label}
              rules={field.rules}
              required={field.rules?.required as boolean}
              previewKey={field.previewKey}
              optionKey={field.optionKey}
              error={
                errors[field.name]?.message
                  ? [errors[field.name]?.message as string]
                  : null
              }
            />
          )}
        />
      );
    case 'slug':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <SlugField
              name={field.name}
              control={control}
              value={''}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'tag':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <TagField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'boolean':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <BooleanField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'number':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <NumberField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              min={field.min}
              max={field.max}
              step={field.step}
              startAdornment={field.startAdornment}
              endAdornment={field.endAdornment}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'checkbox':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <MultiCheckboxField
              name={field.name}
              control={control}
              label={field.label}
              options={field.options || []}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'select':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <SelectField
              name={field.name}
              control={control}
              label={field.label}
              options={field.options || []}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'repeater':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <RepeaterField
              name={field.name}
              label={field.label}
              fields={field.fields || []}
              control={control}
            />
          )}
        />
      );
    case 'date':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <DateField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'datetime':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <DateTimeField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'group':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <GroupField
              name={field.name}
              control={control}
              label={field.label}
              fields={field.fields || []}
            />
          )}
        />
      );
    case 'color':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <ColorField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    case 'location':
      return (
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: { onChange, value } }) => (
            <LocationField
              name={field.name}
              control={control}
              label={field.label}
              required={field.rules?.required as boolean}
              onChange={(value) => onChange(value)}
              error={
                errors[field.name]?.message
                  ? (errors[field.name]?.message as string)
                  : undefined
              }
            />
          )}
        />
      );
    default:
      return null;
  }
};

export default DynamicForm;


