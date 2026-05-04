import { Box, LinearProgress, Tooltip, Typography } from '@mui/material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import React from 'react';

dayjs.extend(duration);

interface ExpiryProgressProps {
  createdAt: string | null;
  expiresAt: string | null;
}

const ExpiryProgress: React.FC<ExpiryProgressProps> = ({
  createdAt,
  expiresAt,
}) => {
  if (!createdAt || !expiresAt) return '-';
  const now = dayjs();
  const start = dayjs(createdAt);
  const end = dayjs(expiresAt);

  const totalDuration = end.diff(start); // in ms
  const elapsed = now.diff(start); // in ms
  const remaining = end.diff(now, 'day'); // days

  const percent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

  return (
    <Box>
      <Tooltip title={`Remaining ${remaining} days`}>
        <Box>
          <LinearProgress
            variant="determinate"
            value={percent}
            sx={{ height: 10, borderRadius: 5 }}
          />
        </Box>
      </Tooltip>
      <Typography
        sx={{ textAlign: 'center', width: '100%' }}
        variant="caption"
        color="textSecondary"
        mt={1}
      >
        {`Remaining ${remaining} / ${dayjs
          .duration(totalDuration)
          .asDays()} days`}
      </Typography>
    </Box>
  );
};

export default ExpiryProgress;


