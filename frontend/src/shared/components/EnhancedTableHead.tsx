import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { EnhancedTableHeadProps } from '@shared/types/table';
import { useTranslation } from 'react-i18next';

const EnhancedTableHead = (props: EnhancedTableHeadProps) => {
  const {
    onSelectAllClick,
    headCells,
    numSelected,
    rowCount,
    multiple = true,
  } = props;
  const { t } = useTranslation();
  return (
    <TableHead>
      <TableRow>
        {multiple ? (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
        ) : (
          ''
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
          >
            <p>{t(headCell.label)}</p>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHead;


