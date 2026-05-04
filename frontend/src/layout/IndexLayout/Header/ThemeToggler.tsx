import { useToasterContext } from '@shared/components/ToasterContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { IconButton } from '@mui/material';
import { Fragment } from 'react';

const ThemeToggler = ({ iconColor }: { iconColor: string }) => {
  const { theme, changeTheme } = useToasterContext();
  return (
    <Fragment>
      <IconButton
        onClick={() => changeTheme(theme == 'dark' ? 'light' : 'dark')}
      >
        {theme == 'dark' ? (
          <Brightness4Icon sx={{ color: iconColor }} />
        ) : (
          <DarkModeIcon sx={{ color: iconColor }} />
        )}
      </IconButton>
    </Fragment>
  );
};

export default ThemeToggler;


