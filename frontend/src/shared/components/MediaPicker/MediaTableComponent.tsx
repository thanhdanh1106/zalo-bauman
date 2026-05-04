import { useToggleSelection } from '@shared/hooks/useToggleSelection';
import { mediaProps, MediaTypeValue } from '@shared/types/media';
import { metaProps } from '@shared/types/meta';
import { filterProps } from '@shared/types/query';
import { findManyMedia } from '@shared/utils/Media';
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import Box from '@mui/material/Box';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoSearchOutline } from 'react-icons/io5';
import {
  MdAllInclusive,
  MdArchive,
  MdAudiotrack,
  MdDescription,
  MdImage,
  MdPictureAsPdf,
  MdVideocam,
} from 'react-icons/md';
import NotFound from '../NotFound';
import Pagination from '../Pagination';
import MediaCard from './MediaCard';

interface MediaPickerProps {
  handleSelect: (media: mediaProps[]) => void;
  defaultData?: mediaProps[];
  onClose: () => void;
  multiple?: boolean;
}

const MediaTableComponent = ({
  handleSelect,
  multiple,
  onClose,
  defaultData,
}: MediaPickerProps) => {
  const [data, setData] = useState<mediaProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { selected, toggle, selectAll, clearAll } = useToggleSelection();

  const [filter, setFilter] = useState<filterProps>({
    search: '',
    order: 'desc',
    paged: 1,
    per_page: 24,
    start_date: null,
    end_date: null,
    media_type: 'all',
  });

  const [meta, setMeta] = useState<metaProps>({
    total: 0,
    current_page: 0,
    from: 0,
    last_page: 0,
    per_page: 0,
  });

  const { t } = useTranslation();

  const handleFindManyData = async (filter: filterProps) => {
    try {
      setIsLoading(true);
      const response = await findManyMedia(filter);
      if (response && !response.error) {
        const { data, meta } = response;
        setData(data);
        setMeta(meta);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFindManyData(filter);
  }, [filter]);

  const handleClick = (id: number) => {
    toggle(id);
  };

  const isSelected = (id: number) => selected.indexOf(id) !== -1;

  function handleSelectMultiple() {
    const media = data.filter((val) => selected.includes(val.id));
    handleSelect(media);
  }

  useEffect(() => {
    if (Array.isArray(defaultData) && defaultData?.length) {
      defaultData.map((val) => toggle(val.id));
    }
  }, [defaultData]);

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

  console.log(filter);
  return (
    <Box>
      <Stack direction={'row'} spacing={2} sx={{ mb: 2 }}>
        <Select
          value={filter?.media_type || 'all'}
          size="small"
          className="w-[160px]"
          onChange={(e: SelectChangeEvent) =>
            setFilter((filter) => ({ ...filter, media_type: e.target.value }))
          }
        >
          {mediaTypes.map((val, index) => {
            return (
              <MenuItem value={val.value} key={index}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <div className="!mr-3">{val.icon}</div>
                  {val.label}
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
        <TextField
          fullWidth
          value={filter?.search}
          placeholder="Search for keyword..."
          size="small"
          sx={{ flex: 1 }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setFilter({ ...filter, search: e.target.value })
          }
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    loading={isLoading}
                    onClick={() => handleFindManyData(filter)}
                  >
                    <IoSearchOutline />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </Stack>
      {Array.isArray(data) && data.length ? (
        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mb-5">
          {data.map((val) => {
            const isItemSelected = isSelected(val.id);
            return (
              <div key={val.id} className="">
                <MediaCard
                  selected={isItemSelected}
                  onSelect={(val) => handleClick(val?.id)}
                  data={val as any}
                />
              </div>
            );
          })}
        </div>
      ) : (
        <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
          <NotFound />
        </Box>
      )}
      {meta ? (
        <Pagination
          meta={meta}
          onChange={(value) => setFilter((filter) => ({ ...filter, ...value }))}
        />
      ) : (
        ''
      )}
      <Divider sx={{ my: 2 }} />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button onClick={() => onClose()}>Close</Button>
        <Button
          variant="contained"
          size="small"
          disabled={!selected.length}
          onClick={() => handleSelectMultiple()}
        >
          {t('select')}
        </Button>
      </Stack>
    </Box>
  );
};

export default MediaTableComponent;


