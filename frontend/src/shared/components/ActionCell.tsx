import DeleteIcon from '@mui/icons-material/Delete';
import ModeIcon from '@mui/icons-material/Mode';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import SettingsIcon from '@mui/icons-material/Settings';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import PopupState, { bindMenu, bindTrigger } from 'material-ui-popup-state';
import { Dispatch, Fragment, ReactNode, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface ActionCellProps {
  rowData: {
    id?: number;
    name?: string;
  };
  editUrl?: string;
  viewUrl?: string;
  setDeleteItem?: Dispatch<SetStateAction<number | null>>;
  children?: ReactNode;
  quickEdit?: () => void;
}

const ActionCell = ({
  rowData,
  editUrl,
  viewUrl,
  quickEdit,
  setDeleteItem,
  children,
}: ActionCellProps) => {
  const { t } = useTranslation();
  return (
    <PopupState variant="popover" popupId="edit-popup-menu">
      {(popupState) => (
        <Fragment>
          <IconButton
            sx={{ margin: 'auto' }}
            size="small"
            {...bindTrigger(popupState)}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            {viewUrl ? (
              <Link target="_blank" to={viewUrl}>
                <MenuItem>
                  <ListItemIcon>
                    <OpenInNewIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('View')}</ListItemText>
                </MenuItem>
              </Link>
            ) : (
              ''
            )}
            {quickEdit ? (
              <MenuItem onClick={quickEdit}>
                <ListItemIcon>
                  <ModeIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Quick edit')}</ListItemText>
              </MenuItem>
            ) : (
              ''
            )}
            {editUrl ? (
              <Link to={editUrl + rowData.id}>
                <MenuItem>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>{t('Edit')}</ListItemText>
                </MenuItem>
              </Link>
            ) : (
              ''
            )}
            {setDeleteItem ? (
              <MenuItem onClick={() => setDeleteItem(rowData?.id || null)}>
                <ListItemIcon>
                  <DeleteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>{t('Delete')}</ListItemText>
              </MenuItem>
            ) : (
              ''
            )}
            {children ? children : ''}
          </Menu>
        </Fragment>
      )}
    </PopupState>
  );
};

export default ActionCell;


