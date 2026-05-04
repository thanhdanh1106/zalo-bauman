import DeleteIcon from '@mui/icons-material/Delete';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';

import { LoadingButton } from '@mui/lab';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface ToolbarProps {
  isLoading: boolean;
  numSelected: number;
  onSubmit: () => void;
}

const EnhancedTableToolbar = (props: ToolbarProps) => {
  const { numSelected, onSubmit, isLoading } = props;
  const { t } = useTranslation();
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <>
          <p>
            {numSelected} {t('selected')}
          </p>
          <Tooltip title="Delete">
            <LoadingButton loading={isLoading} onClick={onSubmit}>
              <DeleteIcon />
            </LoadingButton>
          </Tooltip>
        </>
      ) : (
        ''
      )}
    </Toolbar>
  );
};

export default EnhancedTableToolbar;


