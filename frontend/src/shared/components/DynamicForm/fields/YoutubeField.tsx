import {
  Box,
  FormControl,
  FormHelperText,
  FormLabel,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { FaYoutube } from 'react-icons/fa';

// Helper function to extract YouTube video ID from URL
const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }

  return null;
};

interface YoutubeFieldProps<T extends FieldValues> {
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
}

export const YoutubeField = <T extends FieldValues>({
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
}: YoutubeFieldProps<T>) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [urlError, setUrlError] = useState<string>('');

  const handleUrlChange = (url: string, onChange: (value: string) => void) => {
    onChange(url);
    setUrlError('');

    if (url.trim() === '') {
      setVideoId(null);
      return;
    }

    const extractedVideoId = getYouTubeVideoId(url);
    if (extractedVideoId) {
      setVideoId(extractedVideoId);
    } else {
      setVideoId(null);
      setUrlError('URL YouTube không hợp lệ');
    }
  };

  return (
    <FormControl fullWidth margin="normal" error={!!error || !!urlError}>
      <FormLabel htmlFor={`${name}-label`}>
        {label ? label : ''}{' '}
        {required ? <span className="text-red-600">*</span> : ''}
      </FormLabel>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          // Update video ID when field value changes externally
          useEffect(() => {
            if (field.value) {
              const extractedVideoId = getYouTubeVideoId(field.value);
              setVideoId(extractedVideoId);
              if (!extractedVideoId && field.value.trim() !== '') {
                setUrlError('URL YouTube không hợp lệ');
              } else {
                setUrlError('');
              }
            } else {
              setVideoId(null);
              setUrlError('');
            }
          }, [field.value]);

          return (
            <Box>
              <TextField
                value={field.value || ''}
                onChange={(e) =>
                  handleUrlChange(e.target.value, field.onChange)
                }
                onBlur={field.onBlur}
                disabled={disabled}
                type="text"
                variant="outlined"
                size="small"
                fullWidth
                placeholder="https://www.youtube.com/watch?v=..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FaYoutube color="#FF0000" size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: endAdornment ? (
                    <InputAdornment position="end">
                      {endAdornment}
                    </InputAdornment>
                  ) : undefined,
                }}
              />

              {/* YouTube Video Preview */}
              {videoId && (
                <Box
                  sx={{
                    mt: 2,
                    overflow: 'hidden',
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, fontWeight: 'medium' }}
                  >
                    Video Preview:
                  </Typography>
                  <Box
                    sx={{
                      position: 'relative',
                      paddingBottom: '56.25%', // 16:9 aspect ratio
                      height: 0,
                      '& iframe': {
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: 1,
                      },
                    }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}`}
                      title="YouTube video preview"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </Box>
                </Box>
              )}
            </Box>
          );
        }}
      />
      {(error || urlError) && (
        <FormHelperText>{error || urlError}</FormHelperText>
      )}
      {(description || helper_text) && !error && !urlError && (
        <FormHelperText>{description || helper_text}</FormHelperText>
      )}
    </FormControl>
  );
};


