import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CancelIcon from '@mui/icons-material/Cancel';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { Chip } from '@mui/material';

interface StatusChipProps {
  status: 'pending' | 'approved' | 'rejected' | 'inactive' | '';
}

export default function StatusChip({ status }: StatusChipProps) {
  const chipProps = {
    approved: {
      label: 'Approved',
      color: 'success' as const,
      icon: <CheckCircleIcon />,
    },
    pending: {
      label: 'Pending',
      color: 'warning' as const,
      icon: <HourglassTopIcon />,
    },
    rejected: {
      label: 'Rejected',
      color: 'error' as const,
      icon: <CancelIcon />,
    },
    inactive: {
      label: 'Inactive',
      color: 'default' as const,
      icon: <PauseCircleIcon />,
    },
    '': {
      label: 'Unknown',
      color: 'default' as const,
      icon: <HourglassTopIcon />,
    },
  };

  const props = chipProps[status];

  return <Chip size="small" variant="outlined" {...props} />;
}

