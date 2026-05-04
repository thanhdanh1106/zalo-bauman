import { mediaProps } from '@shared/types/media';
import { Modal } from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';

import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import MediaTableComponent from './MediaTableComponent';
import UploadMediaComponent from './UploadMediaComponent';
import { IoClose } from 'react-icons/io5';

interface MediaPickerProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  multiple?: boolean;
  defaultData?: mediaProps[];
  onSelect: (media: mediaProps | mediaProps[]) => void;
}

const MediaPicker = ({
  open,
  setOpen,
  multiple,
  onSelect,
  defaultData,
}: MediaPickerProps) => {
  const [activeTab, setActiveTab] = useState<'media' | 'upload'>('media');
  const { t } = useTranslation();

  function handleSelect(Images: mediaProps[]) {
    if (!multiple) {
      onSelect(Images[0]);
    } else {
      onSelect(Images);
    }
    setOpen(false);
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      className="flex items-center justify-center p-4 backdrop-blur-sm"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden outline-none border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Select Media</h2>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <IoClose className="text-xl" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-2 border-b border-gray-100">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('media')}
              className={classNames(
                "pb-3 text-sm font-medium transition-all relative",
                {
                  "text-[#484bdf]": activeTab === 'media',
                  "text-gray-500 hover:text-gray-800": activeTab !== 'media'
                }
              )}
            >
              {t('Library')}
              {activeTab === 'media' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#484bdf] rounded-t-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={classNames(
                "pb-3 text-sm font-medium transition-all relative",
                {
                  "text-[#484bdf]": activeTab === 'upload',
                  "text-gray-500 hover:text-gray-800": activeTab !== 'upload'
                }
              )}
            >
              {t('Upload')}
              {activeTab === 'upload' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#484bdf] rounded-t-full" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto bg-gray-50/50 p-6">
          <div className={classNames({ hidden: activeTab !== 'media' }, "h-full")}>
            <MediaTableComponent
              multiple={multiple}
              onClose={() => setOpen(false)}
              handleSelect={handleSelect}
              defaultData={defaultData}
            />
          </div>
          <div className={classNames({ hidden: activeTab !== 'upload' }, "h-full")}>
            <UploadMediaComponent handleSelect={handleSelect} />
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MediaPicker;


