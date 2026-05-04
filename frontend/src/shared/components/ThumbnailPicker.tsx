import { Dispatch, Fragment, SetStateAction, useState } from 'react';
import MediaPicker from './MediaPicker';

import { mediaProps } from '@shared/types/media';
import { formatBytes } from '@shared/utils/Hooks';
import { IconButton, Tooltip } from '@mui/material';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import MediaCell from './ImageCell';

interface ThumbnailPickerProps {
  error?: boolean;
  value: mediaProps | null;
  onChange: Dispatch<SetStateAction<mediaProps | null>>;
}

const ThumbnailPicker = ({ error, value, onChange }: ThumbnailPickerProps) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  return (
    <Fragment>
      {value ? (
        <div
          className={classNames({
            'group relative flex items-center gap-4 rounded-md border border-gray-200 bg-white p-2 transition-all hover:border-gray-300 hover:shadow-sm':
              true,
            '!border-red-500': error,
          })}
        >
          <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-100 bg-gray-50">
            <MediaCell data={value} />
          </div>

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="truncate text-sm font-medium text-gray-900">
              {value?.name || value.file_name}
            </p>
            <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
              <span className="uppercase">{value.mime_type?.split('/')[1] || 'IMG'}</span>
              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
              <span>{formatBytes(value.size)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 pr-1">
            <Tooltip title={t('Thay đổi')}>
              <div
                onClick={() => setOpen(true)}
                className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
              >
                <IoCloudUploadOutline size={18} />
              </div>
            </Tooltip>
            <Tooltip title={t('Xóa')}>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="cursor-pointer rounded-md p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <IoTrashOutline size={18} />
              </div>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setOpen(true)}
          className={classNames({
            'group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 py-8 transition-all hover:border-gray-400 hover:bg-gray-50':
              true,
            '!border-red-500 !bg-red-50/10': error,
          })}
        >
          <div className="rounded-full bg-white p-3 shadow-sm ring-1 ring-gray-200 transition-transform group-hover:scale-110">
            <IoCloudUploadOutline className="text-gray-400 group-hover:text-gray-600" size={24} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {t('Click to upload')}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              {t('SVG, PNG, JPG or GIF (max. 800x400px)')}
            </p>
          </div>
        </div>
      )}
      <MediaPicker
        open={open}
        setOpen={setOpen}
        multiple={false}
        onSelect={(Image) => {
          if (!Array.isArray(Image)) {
            onChange(Image);
          }
        }}
      />
    </Fragment>
  );
};

export default ThumbnailPicker;


