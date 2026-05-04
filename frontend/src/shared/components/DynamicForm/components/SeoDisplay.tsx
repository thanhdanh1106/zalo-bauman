import { mediaProps } from '@/types/media';
import { getThumbnailUrl } from '@shared/utils/Hooks';
import { Box, Stack, Typography } from '@mui/material';
import React from 'react';
import { Control, useWatch } from 'react-hook-form';
import { FaLink } from 'react-icons/fa';

type SeoFormData = {
  title?: string;
  name?: string; // slug
  description?: string;
  thumbnail?: mediaProps;
};

type Props = {
  control: Control<SeoFormData>;
};

const SeoPreview: React.FC<Props> = ({ control }) => {
  // Watch form fields for real-time SEO preview
  const formData = useWatch({
    control,
    name: ['title', 'name', 'description', 'thumbnail'],
  });

  const [title, name, description, thumbnail] = formData || [];

  return (
    <Box className="p-4 flex gap-3 rounded-xl bg-white dark:bg-slate-700 shadow">
      {thumbnail && (
        <Box
          component="img"
          src={getThumbnailUrl(thumbnail)}
          alt="SEO Thumbnail"
          sx={{
            width: 120,
            height: 120,
            objectFit: 'cover',
            borderRadius: 1,
            border: '1px solid #ddd',
          }}
        />
      )}
      <Stack sx={{ flex: 1 }} spacing={0.5}>
        <Typography
          variant="subtitle1"
          fontWeight="bold"
          className="text-blue-700 dark:text-blue-300"
          sx={{ fontSize: '18px', lineHeight: 1.3 }}
        >
          {title || 'SEO title here'}
        </Typography>
        {name && (
          <Typography
            variant="body2"
            color="green"
            sx={{
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <FaLink size={12} />
            {name}
          </Typography>
        )}
        <Typography
          variant="body2"
          color="text.primary"
          sx={{
            fontSize: '13px',
            lineHeight: 1.5,
            mt: 0.5,
          }}
        >
          {description ||
            'SEO description will be displayed here if you enter one.'}
        </Typography>
      </Stack>
    </Box>
  );
};

export default SeoPreview;


