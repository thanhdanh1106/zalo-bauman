import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';

const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <Tooltip title={copied ? 'Copied!' : 'Copy'}>
      <IconButton
        size={'small'}
        onClick={handleCopy}
        color={copied ? 'success' : 'default'}
      >
        <ContentCopyIcon sx={{ width: 12 }} />
      </IconButton>
    </Tooltip>
  );
};

export default CopyButton;


