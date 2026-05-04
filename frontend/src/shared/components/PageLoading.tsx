import { Box, CircularProgress } from '@mui/material';

const PageLoading = ({ height }: { height: string | number }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: height ? height : '100vh',
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default PageLoading;


