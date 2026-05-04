import HomeIcon from '@mui/icons-material/Home';
import { Box, Breadcrumbs, Button, Stack, Typography } from '@mui/material';
import React from 'react';
import { IoArrowUndoOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface NavHeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ElementType;
  breadcrumb?: {
    title?: string;
    url?: string;
  }[];
  backLink?: string;
  endAction?: React.ReactNode;
}
const NavHeader = ({
  title,
  subtitle,
  icon: Icon,
  breadcrumb,
  backLink,
  endAction,
}: NavHeaderProps) => {
  return (
    <Box
      sx={{
        py: 1,
        mb: 3,
      }}
    >
      <Stack
        direction="row"
        justifyContent={'space-between'}
        sx={{ flexWrap: 'wrap' }}
      >
        <Box>
          <Stack direction="row" alignItems="center" sx={{ mb: 1 }} spacing={1}>
            {Icon && <Icon style={{ fontSize: 24, color: '#4b5563' }} />}
            <Typography
              className="!text-2xl !font-bold text-gray-800 "
              variant="h3"
              id="tableTitle"
              component="h3"
            >
              {title}
            </Typography>
          </Stack>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {subtitle}
            </Typography>
          )}
          <Breadcrumbs sx={{ fontSize: 12 }} aria-label="breadcrumb">
            <Link to="/">
              <Stack direction="row" spacing={1}>
                <HomeIcon sx={{ fontSize: 16 }} />
                <Typography sx={{ fontSize: 12 }} color="text.blue">
                  Bảng điều khiển
                </Typography>
              </Stack>
            </Link>
            {Array.isArray(breadcrumb) && breadcrumb.length
              ? breadcrumb.map((val, index) => {
                const { title, url } = val;
                if (!url) {
                  return (
                    <Typography
                      key={index}
                      sx={{ fontSize: 12 }}
                      color="text.primary"
                    >
                      {title}
                    </Typography>
                  );
                } else {
                  return (
                    <Link key={index} color="inherit" to={url}>
                      {title}
                    </Link>
                  );
                }
              })
              : ''}
          </Breadcrumbs>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{
            mt: {
              lg: 0,
              xs: 3,
            },
            width: {
              lg: 'auto',
              xs: '100%',
            },
          }}
        >
          {endAction}
          {backLink ? (
            <Link to={backLink}>
              <Button
                variant="text"
                startIcon={<IoArrowUndoOutline />}
                color="secondary"
              >
                Trở lại
              </Button>
            </Link>
          ) : (
            ''
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default NavHeader;


