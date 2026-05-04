import { Chip } from '@mui/material';
import dayjs from 'dayjs';
import UTC from 'dayjs/plugin/utc';

const statusColors = {
  draft: 'default',
  pending: 'warning',
  published: 'success',
};

dayjs.extend(UTC);

const StatusCell = ({
  status = 'draft',
}: {
  status: keyof typeof statusColors;
}) => {
  return (
    <Chip
      size="small"
      variant="outlined"
      label={status}
      color={statusColors[status] as any}
    />
  );
};

export default StatusCell;


