import { Typography } from '@mui/material';
import { QRCode } from 'react-qrcode-logo'; // hoặc 'qrcode.react' nếu bạn dùng package đó
import CopyButton from './CopyButton';

const PhoneQRCode = ({ phone }: { phone?: string }) => {
  if (!phone) return null;
  return (
    <div className="flex items-center justify-center gap-3 bg-slate-100  border border-slate-200  rounded-lg p-3">
      <QRCode
        value={`tel:${phone}`}
        size={80}
        bgColor="#ffffff"
        fgColor="#000000"
        ecLevel="H"
      />
      <div className="flex-1 pl-3">
        <Typography
          className="!text-xs "
          fontWeight={400}
          variant="subtitle1"
          mb={1}
        >
          Scan to call
        </Typography>
        <Typography
          fontWeight="bold"
          variant="body2"
          color="text.secondary"
          mt={1}
        >
          {phone} <CopyButton text={phone} />
        </Typography>
      </div>
    </div>
  );
};

export default PhoneQRCode;


