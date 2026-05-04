import React, { useEffect, useRef, useState } from 'react';
import { IoCloudUploadOutline } from 'react-icons/io5';

interface InputDragDataProps {
  multiple?: boolean;
  progress: number;
  setDataInput: (dataFile: FileList) => void;
}

function InputDragData({
  multiple = true,
  progress,
  setDataInput,
}: InputDragDataProps) {
  const [isDrop, setIsDrop] = useState<boolean>(false);
  const [getData, setGetData] = useState<null | FileList>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (getData) {
      setDataInput(getData);
      clearFile();
      setGetData(null);
    }
  }, [getData]);

  function dragOver(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    setIsDrop(true);
  }

  function drop(ev: React.DragEvent<HTMLDivElement>) {
    ev.preventDefault();
    const droppedItem = ev.dataTransfer.files;

    if (droppedItem.length > 0) {
      // Validate files before processing
      const validFiles: File[] = [];
      const maxSize = 30 * 1024 * 1024; // 30MB

      Array.from(droppedItem).forEach((file) => {
        if (file.size > maxSize) {
          console.warn(`File "${file.name}" exceeds size limit of 30MB`);
          return;
        }
        validFiles.push(file);
      });

      if (validFiles.length > 0) {
        // Create a new FileList-like object with valid files
        const dataTransfer = new DataTransfer();
        validFiles.forEach((file) => dataTransfer.items.add(file));
        setGetData(dataTransfer.files);
      }
    }
    setIsDrop(false);
  }

  const clearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      onDragOver={dragOver}
      onDragLeave={() => setIsDrop(false)}
      onDrop={drop}
      className="flex border border-dashed border-slate-200     rounded-xl items-center justify-center w-auto my-4"
    >
      <label
        htmlFor="dropzone-file"
        className={
          (isDrop
            ? 'border-blue-300 bg-gray-200  '
            : 'border-gray-300 bg-gray-50  ') +
          ' flex flex-col relative items-center justify-center w-full h-64 border-1 border-dashed rounded-md cursor-pointer hover:border-blue-300 hover:bg-gray-100 '
        }
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <IoCloudUploadOutline size={32} className="mb-5" />
          <p className="text-sm">Click or drag and drop to upload files</p>
          <p className="text-sm">Maximum allowed is 30MB</p>
          {progress ? (
            <div className="py-1 h-5 relative mx-10 z-[2] w-[300px] mt-4">
              <div className="absolute top-0 bottom-0 left-0 w-full rounded-md-[100px] h-2 bg-gray-400"></div>
              <div
                style={{ width: `${progress}%` }}
                className="absolute top-0 bottom-0 left-0 h-2 rounded-md-[100px] transition-all duration-150 bg-orange-300"
              ></div>
              <div className="relative top-full flex items-center justify-center w-full h-full">
                <span className="text-sm font-bold text-blue">{progress}%</span>
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <input
          ref={fileInputRef}
          id="dropzone-file"
          type="file"
          className="absolute z-[2] w-full h-full opacity-0"
          multiple={multiple}
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
          onChange={(event) => {
            const files = event.target.files;
            if (files) {
              // Validate files before processing
              const validFiles: File[] = [];
              const maxSize = 30 * 1024 * 1024; // 30MB

              Array.from(files).forEach((file) => {
                if (file.size > maxSize) {
                  console.warn(
                    `File "${file.name}" exceeds size limit of 30MB`
                  );
                  return;
                }
                validFiles.push(file);
              });

              if (validFiles.length > 0) {
                // Create a new FileList-like object with valid files
                const dataTransfer = new DataTransfer();
                validFiles.forEach((file) => dataTransfer.items.add(file));
                setGetData(dataTransfer.files);
              }
            }
          }}
        />
      </label>
    </div>
  );
}

export default InputDragData;


