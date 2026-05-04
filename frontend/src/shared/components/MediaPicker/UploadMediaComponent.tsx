import { uploadMedia } from '@shared/utils/Media';
import message from '@shared/utils/message.json';
import { useState } from 'react';
import { useToasterContext } from '../ToasterContext';

import { mediaProps } from '@shared/types/media';
import InputDragData from '../InputDragData';

interface ProgressEvent<T extends EventTarget = EventTarget> extends Event {
  readonly target: T | null;
  readonly lengthComputable: boolean;
  readonly loaded: number;
  readonly total: number;
}

interface MediaPickerProps {
  handleSelect: (value: mediaProps[]) => void;
}

const UploadMediaComponent = ({ handleSelect }: MediaPickerProps) => {
  const [processUpload, setProgress] = useState<number>(0);

  const { showMessage } = useToasterContext();

  function onProgress(progressEvent: ProgressEvent) {
    const percentage = (progressEvent.loaded * 100) / progressEvent.total;
    setProgress(+percentage.toFixed(2));
  }

  const handleSetDataFile = (dataFile: FileList) => {
    if (dataFile && dataFile.length > 0) {
      // Process files sequentially to avoid overwhelming the server
      processFilesSequentially(Array.from(dataFile));
    }
  };

  const processFilesSequentially = async (files: File[]) => {
    const uploadedFiles: mediaProps[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file
      if (!file) {
        console.warn(`File at index ${i} is invalid`);
        continue;
      }

      // Check file size (optional - adjust as needed)
      const maxSize = 30 * 1024 * 1024; // 30MB as mentioned in UI
      if (file.size > maxSize) {
        showMessage(
          'error',
          `File "${file.name}" is too large. Maximum size is 30MB.`
        );
        continue;
      }

      try {
        const formData = new FormData();
        formData.append('file', file);

        // Add any additional metadata if needed
        formData.append('filename', file.name);
        formData.append('filesize', file.size.toString());
        formData.append('mimetype', file.type);

        const uploadedFile = await handleUploadFile(formData);
        if (uploadedFile) {
          uploadedFiles.push(uploadedFile);
        }
      } catch (error) {
        console.error(`Error uploading file "${file.name}":`, error);
        showMessage('error', `Failed to upload "${file.name}"`);
      }
    }

    // Notify parent component of all successfully uploaded files
    if (uploadedFiles.length > 0) {
      handleSelect(uploadedFiles);
      showMessage(
        'success',
        `Successfully uploaded ${uploadedFiles.length} file(s)`
      );
    }
  };

  async function handleUploadFile(data: FormData): Promise<mediaProps | null> {
    try {
      setProgress(0);
      const response = await uploadMedia(data, onProgress);

      if (response && !response.error) {
        const { data: uploadedData, error } = response;
        if (!error && uploadedData) {
          showMessage('success', message.media.create_successful);
          return uploadedData;
        } else {
          showMessage('error', message.media.create_failed);
          return null;
        }
      } else {
        showMessage('error', message.media.create_failed);
        return null;
      }
    } catch (error) {
      console.error('error', error);
      showMessage('error', message.media.create_failed);
      return null;
    } finally {
      setProgress(0);
    }
  }

  return (
    <InputDragData
      multiple={true}
      setDataInput={handleSetDataFile}
      progress={processUpload}
    />
  );
};

export default UploadMediaComponent;


