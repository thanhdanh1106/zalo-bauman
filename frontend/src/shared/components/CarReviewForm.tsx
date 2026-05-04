import { createCarReview } from '@shared/utils/CarReviews';
import message from '@shared/utils/message.json';
import { Alert, Box, Button, Grid, Rating, TextField } from '@mui/material';
import React, { useState } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useToasterContext } from './ToasterContext';

type FormInputs = {
  name: string;
  email: string;
  comment: string;
  price: number;
  service: number;
  safety: number;
  entertainment: number;
  accessibility: number;
  support: number;
};

const ratingLabels = {
  price: 'Price',
  service: 'Service',
  safety: 'Safety',
  entertainment: 'Entertainment',
  accessibility: 'Accessibility',
  support: 'Support',
};

const ratingKeys = Object.keys(ratingLabels) as (keyof typeof ratingLabels)[];

const CarReviewForm: React.FC<{ car: number }> = ({ car }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    setError,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      name: '',
      email: '',
      comment: '',
      price: 0,
      service: 0,
      safety: 0,
      entertainment: 0,
      accessibility: 0,
      support: 0,
    },
  });

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const { showMessage } = useToasterContext();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    try {
      setIsLoading(true);
      const ratingFields = [
        'price',
        'service',
        'safety',
        'entertainment',
        'accessibility',
        'support',
      ] as const;

      const allRated = ratingFields.every((field) => data[field] > 0);

      if (!allRated) {
        setError('price', {
          type: 'manual',
          message: message.review.rating_score_invalid,
        });
        return;
      }
      const response = await createCarReview({
        car: car,
        ...data,
      });

      if (response && !response.error) {
        if (data) {
          showMessage('success', message.response.create_successful);
          reset();
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-xl border-slate-200  ">
      <h2 className="text-lg font-bold text-gray-800  mb-3">
        {t('Add a Review')}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={3}>
          {ratingKeys.map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Controller
                name={key}
                control={control}
                render={({ field }) => (
                  <Box>
                    <p className=" text-sm mb-2">{ratingLabels[key]}</p>
                    <Rating
                      className=""
                      value={field.value}
                      onChange={(_, value) => field.onChange(value ?? 0)}
                    />
                  </Box>
                )}
              />
            </Grid>
          ))}
        </Grid>

        {errors.price && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {(errors.price as any)?.message}
          </Alert>
        )}

        <Box mt={4}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                {...register('name', { required: 'Name is required' })}
                size="small"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                size="small"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Your Comment"
                size="small"
                multiline
                rows={4}
                {...register('comment', { required: 'Comment is required' })}
                error={!!errors.comment}
                helperText={errors.comment?.message}
              />
            </Grid>
          </Grid>
        </Box>

        <Box mt={4}>
          <Button
            loading={isLoading}
            variant="contained"
            color="primary"
            type="submit"
          >
            Submit Review
          </Button>
        </Box>
      </form>
    </div>
  );
};

export default CarReviewForm;


