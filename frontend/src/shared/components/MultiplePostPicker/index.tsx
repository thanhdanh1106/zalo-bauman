import { metaProps } from '@shared/types/meta';
import { PickerProps } from '@shared/types/picker';
import { filterProps } from '@shared/types/query';
import { Box, Button, Modal } from '@mui/material';
import React, { Fragment, useState } from 'react';
import { IoAdd } from 'react-icons/io5';
import PostTableComponent from './PostTableComponent';

interface MultiplePostPickerProps<T> {
  label?: string;
  name?: string;
  size?: string;
  defaultData?: T | null;
  defautSearchParams?: filterProps;
  getApi: (params: filterProps) => Promise<{
    error: boolean;
    data: PickerProps[];
    meta: metaProps;
    message: string;
  }>;
  values: T[];
  labelStyle: object;
  onChange: (value: PickerProps[] | null) => void;
  valueKey: string;
  optionKey: string;
  previewKey?: string | null;
  error?: string[] | null | undefined;
  required?: boolean;
  children?: React.ReactNode;
}

const MultiplePostPicker = <T,>({
  label,
  labelStyle = {},
  defaultData,
  defautSearchParams = {},
  getApi,
  values,
  onChange,
  valueKey = 'id',
  optionKey,
  previewKey,
  error,
  required,
  children,
}: MultiplePostPickerProps<T>) => {
  const [open, setOpen] = useState(false);

  function handleChangeData(value: PickerProps[] | null) {
    setOpen(false);
    onChange(value);
  }

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 680,
    maxWidth: '90vw',
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  return (
    <Fragment>
      <div>
        <Button onClick={() => setOpen(true)} startIcon={<IoAdd />}>
          Add post
        </Button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box sx={style}>
          <PostTableComponent
            getApi={getApi}
            handleSelect={(value) =>
              Array.isArray(value)
                ? handleChangeData(value)
                : handleChangeData([value])
            }
            multiple={true}
            defaultData={values ? values : []}
          />
        </Box>
      </Modal>
    </Fragment>
  );
};

export default MultiplePostPicker;


