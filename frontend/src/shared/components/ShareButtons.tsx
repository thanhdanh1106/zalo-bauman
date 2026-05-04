import { Badge } from '@mui/material';
import React from 'react';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  FacebookMessengerShareButton,
  FacebookShareButton,
  FacebookShareCount,
  LinkedinIcon,
  LinkedinShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share';

type ShareButtonsProps = {
  pathname: string;
  title?: string;
};

const ShareButtons: React.FC<ShareButtonsProps> = ({ pathname, title }) => {
  let url = import.meta.env.VITE_API_URL + pathname;
  return (
    <div className="flex gap-3 p-3">
      <Badge
        badgeContent={
          <FacebookShareCount url={url}>
            {(shareCount) => shareCount}
          </FacebookShareCount>
        }
      >
        <FacebookShareButton url={url} title={title}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>
      </Badge>

      <FacebookMessengerShareButton url={url} appId="YOUR_FACEBOOK_APP_ID">
        <FacebookMessengerIcon size={32} round />
      </FacebookMessengerShareButton>

      <WhatsappShareButton url={url} title={title}>
        <WhatsappIcon size={32} round />
      </WhatsappShareButton>

      <TwitterShareButton url={url} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>

      <LinkedinShareButton url={url} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>

      <EmailShareButton
        url={url}
        subject={title}
        body={`Check this out: ${url}`}
      >
        <EmailIcon size={32} round />
      </EmailShareButton>
    </div>
  );
};

export default ShareButtons;


