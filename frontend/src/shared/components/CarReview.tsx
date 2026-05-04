import { metaProps } from '@shared/types/meta';
import { filterProps } from '@shared/types/query';
import { userProps } from '@shared/types/user';
import {
  findCarReviewsSummary,
  findManyCarReviewsByCar,
} from '@shared/utils/CarReviews';
import { getUserFullName } from '@shared/utils/Hooks';
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Pagination,
  Rating,
  Typography,
} from '@mui/material';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import UserAvatar from './UserAvatar';
dayjs.extend(relativeTime);

interface ReviewType {
  id: number;
  name: string;
  user: userProps;
  rating: number;
  comment: string;
  created_at: string;
  service: number;
  safety: number;
  entertainment: number;
  accessibility: number;
  support: number;
}

interface Breakdown {
  label: string;
  score: string;
  percentage: number;
}

export interface reviewSummaryProps {
  ratingBreakdown: RatingBreakdown[];
  total_reviews: number;
  total_average_score: number;
}

export interface RatingBreakdown {
  label: string;
  score: string;
  percentage: number;
}

const overallRating = { score: '4.95/5', totalReviews: 1672, stars: 5 };

const CarReview: React.FC<{ car: number }> = ({ car }) => {
  const [reviewSummary, setReviewSummary] = useState<reviewSummaryProps | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [reviews, setReviews] = useState<ReviewType[] | null>(null);
  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });
  const [filter, setFilter] = useState<filterProps>({
    search: '',
    order: 'desc',
    paged: 1,
    per_page: 12,
    start_date: null,
    end_date: null,
  });

  async function hanlefindCarReviewsSummary() {
    try {
      const response = await findCarReviewsSummary(car);

      if (response && !response.error) {
        const { data } = response;
        setReviewSummary(data);
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  async function handleFindManyReview(filter: filterProps) {
    try {
      setIsLoading(true);
      const response = await findManyCarReviewsByCar(car, filter);

      if (response && !response.error) {
        const { data, meta } = response;
        setReviews(data);
        setMeta(meta);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleFindManyReview(filter);
    hanlefindCarReviewsSummary();
  }, []);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setFilter({ ...filter, paged: page });
  };

  function calculateTotalAverageScore(
    service: number,
    safety: number,
    entertainment: number,
    accessibility: number,
    support: number
  ): number {
    const values = [
      service ?? 0,
      safety ?? 0,
      entertainment ?? 0,
      accessibility ?? 0,
      support ?? 0,
    ];

    const sum = values.reduce((a, b) => a + b, 0);
    return Math.round((sum / values.length) * 10) / 10; // làm tròn 1 chữ số thập phân
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <h2 className="text-lg font-bold text-gray-800  mb-3">
          Rate & Reviews
        </h2>
        <IconButton disabled>
          <Typography variant="body2">▼</Typography>
        </IconButton>
      </Box>
      <div className="border p-4 rounded-xl border-slate-200  ">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <div className="bg-slate-100  py-5 h-full rounded-lg border border-slate-200  flex items-center justify-center">
              <div className="text-center">
                <Typography variant="h4" fontWeight="bold">
                  {reviewSummary?.total_average_score}/5
                </Typography>
                <Rating
                  value={Math.ceil(reviewSummary?.total_average_score || 1)}
                  readOnly
                />
                <Typography variant="body2">
                  ({reviewSummary?.total_reviews} reviews)
                </Typography>
              </div>
            </div>
          </Grid>

          <Grid item xs={12} md={8}>
            {reviewSummary?.ratingBreakdown.map((r) => (
              <Grid
                container
                alignItems="center"
                spacing={1}
                key={r.label}
                mb={1}
              >
                <Grid item xs={3}>
                  <Typography variant="body2">{r.label}</Typography>
                </Grid>
                <Grid item xs={7}>
                  <LinearProgress variant="determinate" value={r.percentage} />
                </Grid>
                <Grid item xs={2}>
                  <Typography variant="body2" align="right">
                    {r.score}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </div>
      <div className="space-y-6">
        {Array.isArray(reviews) && reviews?.length
          ? reviews.map((rev) => {
              return (
                <div
                  className="border p-4 rounded-xl border-slate-200  "
                  key={rev.id}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <UserAvatar data={rev.user} />
                    <Box>
                      <Typography fontWeight="bold">
                        {getUserFullName(rev.user)}
                      </Typography>
                      <Typography variant="body2">
                        {dayjs(rev.created_at).fromNow()}
                      </Typography>
                    </Box>
                    <Box ml="auto">
                      <Rating
                        value={calculateTotalAverageScore(
                          rev.service,
                          rev.safety,
                          rev.entertainment,
                          rev.accessibility,
                          rev.support
                        )}
                        readOnly
                      />
                    </Box>
                  </Box>
                  <Typography variant="body2">{rev.comment}</Typography>
                </div>
              );
            })
          : ''}
      </div>
      {meta?.last_page !== 1 ? (
        <div className="flex justify-center mt-5">
          <Pagination count={meta?.last_page} onChange={handleChange} />
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default CarReview;


