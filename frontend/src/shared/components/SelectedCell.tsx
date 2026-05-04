import IconButton from '@mui/material/IconButton';
import classNames from 'classnames';
import { useCallback } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { IoTrashOutline } from 'react-icons/io5';
import { RxDragHandleDots2 } from 'react-icons/rx';

interface SelectedCellProps<T> {
  data: object;
  onClear: (id: number) => void;
  display_key?: string;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableItem = ({
  row,
  display_key,
  index,
  onClear,
}: {
  row: any;
  index: number;
  display_key?: string;
  onClear: (id: number) => void;
}) => {
  return (
    <Draggable draggableId={String(row.id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="border flex gap-2 bg-neutral-100/85 border-neutral-200   backdrop-blur-md items-center text-sm rounded-lg px-2 py-2"
          style={{ ...provided.draggableProps.style, cursor: 'move' }}
        >
          <span>
            <RxDragHandleDots2 />
          </span>
          <div className="flex-1">
            {display_key ? row[display_key] : row.title}
          </div>
          <div>
            <IconButton
              size="small"
              sx={{ margin: 'auto' }}
              onClick={() => onClear(row.id)}
            >
              <IoTrashOutline size={14} />
            </IconButton>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const SelectedCell = <T,>({
  data,
  onClear,
  display_key,
  onReorder,
}: SelectedCellProps<T>) => {
  const moveItem = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      if (onReorder) {
        onReorder(dragIndex, hoverIndex);
      }
    },
    [onReorder]
  );
  const onDragEnd = (result: any) => {
    if (!result.destination || !onReorder) return;
    moveItem(result.source.index, result.destination.index);
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {Array.isArray(data) && data.length ? (
        <Droppable droppableId="post-items">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classNames({
                'grid grid-cols-1 mt-5 bg-white border border-slate-200   rounded-lg p-3 flex-wrap gap-3 duration-300':
                  true,
                '!bg-green-100': snapshot.isDraggingOver,
              })}
            >
              {Array.isArray(data) && data.length
                ? data.map((row, index) => (
                    <DraggableItem
                      key={row.id}
                      row={row}
                      index={index}
                      onClear={onClear}
                    />
                  ))
                : ''}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        ''
      )}
    </DragDropContext>
  );
};

export default SelectedCell;


