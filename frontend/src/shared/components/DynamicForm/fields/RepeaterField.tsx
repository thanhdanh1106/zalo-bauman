import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import classNames from 'classnames';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useFieldArray } from 'react-hook-form';
import { IoLayersOutline, IoTrash } from 'react-icons/io5';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { FormField, renderField } from '..';

interface RepeaterFieldProps {
  name: string;
  label: string;
  fields: FormField[];
  description?: string;
  helper_text?: string;
}

export function RepeaterField({
  name,
  label,
  fields,
  control,
  description,
  helper_text,
}: RepeaterFieldProps & { control: any }) {
  const {
    fields: items,
    append,
    remove,
    move,
  } = useFieldArray<Record<string, any>>({
    control,
    name,
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.index === destination.index) return;
    move(source.index, destination.index);
  };

  return (
    <Accordion
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        mb: 1,
      }}
    >
      <AccordionSummary expandIcon={<KeyboardArrowDownIcon />}>
        <Typography
          className="flex gap-1 items-center"
          variant="subtitle1"
          sx={{ fontWeight: 'bold', mb: 1 }}
        >
          <IoLayersOutline />
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={`repeater_${Date.now().toFixed()}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={classNames({
                  'grid grid-cols-1 mt-5 rounded flex-wrap gap-3 duration-300':
                    true,
                  'bg-green-100 ': snapshot.isDraggingOver,
                })}
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={classNames({
                          'duration-300': true,
                          'bg-orange-200 ': snapshot.isDragging,
                        })}
                        sx={{
                          px: 2,
                          py: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          mb: 3,
                          position: 'relative',
                        }}
                      >
                        <Stack
                          className="absolute right-0 bottom-[100%]"
                          direction="row"
                          spacing={0}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="border rounded-t-lg border-gray-200 text-gray-600 font-semibold bg-gray-100    rounded-tr-1 flex gap-1 items-center px-2 py-[1.5]"
                          >
                            <RxDragHandleDots2 />
                            Drag
                          </div>
                          <button
                            type="button"
                            className="border rounded-t-lg border-red-200 text-red-600 font-semibold bg-red-100 rounded-lt-1 flex gap-1 items-center px-2 py-[1.5]"
                            onClick={() => remove(index)}
                          >
                            <IoTrash className="" />
                            Remove
                          </button>
                        </Stack>
                        <Grid container spacing={2}>
                          {fields.map((fieldDef) => {
                            const uniqueField = {
                              ...fieldDef,
                              name: `${name}[${index}].${fieldDef.name}`,
                            };
                            return (
                              <Grid
                                item
                                key={fieldDef.name}
                                xs={12}
                                lg={fieldDef?.size}
                              >
                                {renderField(uniqueField, control, {})}
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
        <Button
          variant="outlined"
          size="small"
          onClick={() => append({})}
          sx={{ mt: 1 }}
        >
          + Add {label}
        </Button>
      </AccordionDetails>
    </Accordion>
  );
}


