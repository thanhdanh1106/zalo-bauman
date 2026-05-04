import { MediaTypeValue } from '@shared/types/media';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import React from 'react';
import {
  MdAllInclusive,
  MdArchive,
  MdAudiotrack,
  MdDescription,
  MdImage,
  MdPictureAsPdf,
  MdVideocam,
} from 'react-icons/md';

export interface MediaTypeFilterProps {
  value: MediaTypeValue;
  onChange: (value: MediaTypeValue) => void;
}

const mediaTypes: {
  value: MediaTypeValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: 'all', label: 'All', icon: <MdAllInclusive /> },
  { value: 'image', label: 'Image', icon: <MdImage /> },
  { value: 'video', label: 'Video', icon: <MdVideocam /> },
  { value: 'pdf', label: 'PDF', icon: <MdPictureAsPdf /> },
  { value: 'audio', label: 'Audio', icon: <MdAudiotrack /> },
  { value: 'zip', label: 'Archive', icon: <MdArchive /> },
  { value: 'doc', label: 'Document', icon: <MdDescription /> },
];

const MediaTypeFilter: React.FC<MediaTypeFilterProps> = ({
  value = 'all',
  onChange,
}) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      fullWidth
      sx={{ backgroundColor: (theme) => theme.palette.background.paper }}
      onChange={(_, val) => val && onChange(val)}
      size="small"
      color="primary"
    >
      {mediaTypes.map((type) => (
        <ToggleButton key={type.value} value={type.value}>
          {type.icon}
          <span style={{ marginLeft: 4 }}>{type.label}</span>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default MediaTypeFilter;


