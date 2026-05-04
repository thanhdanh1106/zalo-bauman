import MediaPicker from '@shared/components/MediaPicker';
import { useToasterContext } from '@shared/components/ToasterContext';
import { mediaProps } from '@/types/media';
import { FormControl, FormHelperText, FormLabel } from '@mui/material';
import { Fragment, useState } from 'react';
import { Controller, useController, UseControllerProps } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IoAdd, IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';
import classNames from 'classnames';
import { getThumbnailUrl } from '@shared/utils/Hooks';

interface GalleryFieldProps extends UseControllerProps {
  label?: string;
  required?: boolean;
  multiple?: boolean;
  error?: string;
  description?: string;
  helper_text?: string;
}

export const GalleryField = ({
  name,
  control,
  label,
  required = false,
  multiple = true,
  error,
  description,
  helper_text,
}: GalleryFieldProps) => {
  const { t } = useTranslation();
  const { field } = useController({
    name,
    control,
    defaultValue: [],
  });

  const [open, setOpen] = useState(false);
  const { showMessage } = useToasterContext();

  const handleChange = (value: mediaProps[] | null) => {
    if (!value || value.length === 0) return;

    const currentValues: mediaProps[] = field.value || [];
    const currentIds = currentValues.map((item) => item.id);

    const newItems = value.filter((item) => !currentIds.includes(item.id));

    if (newItems.length === 0) {
      showMessage('error', 'All images are available!');
    } else {
      const updatedValues = [...currentValues, ...newItems];
      field.onChange(updatedValues);
      showMessage('success', `Added new ${newItems.length} images!`);
    }
  };

  const handleRemove = (id: number) => {
    const currentValues: { id: number }[] = field.value || [];
    const filteredValues = currentValues.filter((item) => item?.id != id);
    field.onChange(filteredValues);
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const currentValues: mediaProps[] = [...(field.value || [])];
    const [reorderedItem] = currentValues.splice(result.source.index, 1);
    currentValues.splice(result.destination.index, 0, reorderedItem);

    field.onChange(currentValues);
  };

  return (
    <FormControl fullWidth margin="normal" error={!!error}>
      <div className="flex items-center justify-between mb-2">
        <FormLabel htmlFor={`${name}-label`} className="!text-sm !font-medium !text-gray-900">
          {label} {required && <span className="text-red-500">*</span>}
        </FormLabel>
        {description && <span className="text-xs text-gray-500">{description}</span>}
      </div>

      <Controller
        name={name}
        control={control}
        render={({ field: { value } }) => (
          <Fragment>
            <MediaPicker
              open={open}
              setOpen={setOpen}
              multiple={multiple}
              defaultData={value}
              onSelect={(val) => {
                if (Array.isArray(val)) {
                  handleChange(val);
                }
              }}
            />

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="gallery-grid" direction="horizontal">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                  >
                    {/* Upload Button (Empty State or Add More) */}
                    <div
                      onClick={() => setOpen(true)}
                      className={classNames(
                        "aspect-square rounded-lg border-2 border-dashed border-gray-200 hover:border-[#484bdf] hover:bg-gray-50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group",
                        { "col-span-2 sm:col-span-3 md:col-span-4 !aspect-auto h-32": !value?.length }
                      )}
                    >
                      <div className="w-[44px] h-[44px] rounded-full bg-gray-100 group-hover:bg-[#484bdf]/10 flex items-center justify-center transition-colors">
                        {value?.length ? (
                          <IoAdd className="text-xl text-gray-500 group-hover:text-[#484bdf]" />
                        ) : (
                          <IoCloudUploadOutline className="text-xl text-gray-500 group-hover:text-[#484bdf]" />
                        )}
                      </div>
                      {!value?.length && (
                        <div className="text-center">
                          <p className="text-sm font-medium text-gray-900">Click to upload</p>
                          <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
                        </div>
                      )}
                    </div>

                    {/* Images */}
                    {Array.isArray(value) &&
                      value.map((item: mediaProps, index: number) => (
                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={classNames(
                                "relative aspect-square rounded-lg border border-gray-200 bg-white overflow-hidden group hover:shadow-md transition-all",
                                { "ring-2 ring-[#484bdf] ring-offset-2 z-10": snapshot.isDragging }
                              )}
                            >
                              <img
                                src={getThumbnailUrl(item)}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />

                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(item.id);
                                  }}
                                  className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors transform scale-90 hover:scale-100"
                                >
                                  <IoTrashOutline />
                                </button>
                              </div>

                              {/* File Info Badge */}
                              <div className="absolute bottom-2 left-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-[10px] font-medium text-gray-700 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                                {item.name || item.file_name}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Fragment>
        )}
      />
      {helper_text && <FormHelperText>{helper_text}</FormHelperText>}
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};


