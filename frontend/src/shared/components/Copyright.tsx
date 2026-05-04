import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright(props: any) {
  return (
    <div className="py-3 mt-10">
      <Typography
        variant="body2"
        align="center"
        {...props}
        sx={[
          {
            color: 'text.secondary',
          },
          ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
        ]}
      >
        {'Copyright © '}
        <Link color="inherit" href="/">
          App base
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    </div>
  );
}


