import { EmojiEmotions as EmojiIcon } from '@mui/icons-material';
import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  Popover,
  TextField,
} from '@mui/material';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { useRef, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface TextAreaFieldProps<T extends FieldValues> {
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
  multiline?: boolean;
  rows?: number;
  enableEmoji?: boolean; // New prop to enable emoji picker
}

export const TextAreaField = <T extends FieldValues>({
  name,
  control,
  label,
  required = false,
  disabled = false,
  error,
  startAdornment,
  endAdornment,
  description,
  helper_text,
  multiline,
  rows = 4,
  enableEmoji = true, // Default to true for textarea fields
}: TextAreaFieldProps<T>) => {
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLButtonElement | null>(
    null
  );
  const [fieldValue, setFieldValue] = useState<string>('');
  const textFieldRef = useRef<HTMLInputElement>(null);

  const handleEmojiClick = () => {
    setEmojiAnchorEl(
      textFieldRef.current?.querySelector('button') as HTMLButtonElement
    );
  };

  const handleEmojiClose = () => {
    setEmojiAnchorEl(null);
  };

  const handleEmojiSelect = (
    emojiData: EmojiClickData,
    onChange: (value: string) => void
  ) => {
    const emoji = emojiData.emoji;
    const newValue = fieldValue + emoji;
    setFieldValue(newValue);
    onChange(newValue);
    // Note: We don't close the picker here to allow multiple emoji selection
  };
  const isEmojiOpen = Boolean(emojiAnchorEl);

  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <FormLabel htmlFor={`${name}-label`}>
        {label ? label : ''}{' '}
        {required ? <span className="text-red-600">*</span> : ''}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Update local state when field value changes externally
          if (field.value !== fieldValue) {
            setFieldValue(field.value || '');
          }
          return (
            <Box ref={textFieldRef} position="relative" sx={{ width: '100%' }}>
              <TextField
                value={field.value || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue(value);
                  field.onChange(value);
                }}
                onBlur={field.onBlur}
                disabled={disabled}
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                minRows={rows || 4}
                multiline={multiline}
                InputProps={{
                  startAdornment: startAdornment ? (
                    <InputAdornment position="start">
                      {startAdornment}
                    </InputAdornment>
                  ) : undefined,
                  endAdornment: (
                    <InputAdornment position="end">
                      {enableEmoji && (
                        <IconButton
                          onClick={handleEmojiClick}
                          size="small"
                          disabled={disabled}
                          sx={{
                            color: 'action.active',
                            position: 'absolute',
                            right: 10,
                            bottom: 10,
                            zIndex: 1,
                            '&:hover': { color: 'primary.main' },
                          }}
                        >
                          <EmojiIcon fontSize="small" />
                        </IconButton>
                      )}
                      {endAdornment}
                    </InputAdornment>
                  ),
                }}
              />

              {/* Emoji Picker Popover */}
              <Popover
                open={isEmojiOpen}
                anchorEl={emojiAnchorEl}
                onClose={handleEmojiClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: {
                    boxShadow: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                  },
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 1,
                      pb: 1,
                      borderBottom: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Box sx={{ fontSize: '0.875rem', fontWeight: 'medium' }}>
                      Pick multiple emojis
                    </Box>
                    <IconButton
                      size="small"
                      onClick={handleEmojiClose}
                      sx={{
                        color: 'text.secondary',
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      ✕
                    </IconButton>
                  </Box>
                  <EmojiPicker
                    onEmojiClick={(emojiData) =>
                      handleEmojiSelect(emojiData, field.onChange)
                    }
                    width={350}
                    height={400}
                    searchDisabled={false}
                    skinTonesDisabled={false}
                    previewConfig={{
                      showPreview: true,
                    }}
                  />
                </Box>
              </Popover>
            </Box>
          );
        }}
      />
      {error && <FormHelperText>{error}</FormHelperText>}
      {(description || helper_text) && !error && (
        <FormHelperText>{description || helper_text}</FormHelperText>
      )}
    </FormControl>
  );
};


