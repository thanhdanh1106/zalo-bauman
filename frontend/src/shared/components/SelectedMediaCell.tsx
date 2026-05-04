import { formatBytes, getThumbnailUrl } from "@shared/utils/Hooks";
import IconButton from "@mui/material/IconButton";
import classNames from "classnames";
import { useCallback } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { IoTrashOutline } from "react-icons/io5";
import { RxDragHandleDots2 } from "react-icons/rx";

interface SelectedMediaCellProps<T> {
  data: object;
  onClear: (id: number) => void;
  onReorder?: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableItem = ({
  row,
  index,
  onClear,
}: {
  row: any;
  index: number;
  onClear: (id: number) => void;
}) => {
  const { id, name, mime_type, size, file_name, uuid } = row;
  return (
    <Draggable draggableId={String(id)} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="border flex gap-2 bg-neutral-100/85 border-neutral-200 backdrop-blur-md items-center text-sm rounded-lg px-2 py-2"
          style={{ ...provided.draggableProps.style, cursor: "move" }}
        >
          <span>
            <RxDragHandleDots2 className="" />
          </span>
          <div>
            <img
              className="aspect-square w-[80px] bg-slaye-100 border border-slate-200  rounded-lg shadow object-center object-cover"
              src={getThumbnailUrl(row)}
            />
          </div>
          <div className="flex-1 h-full px-3 py-2">
            <p className="font-semibold mb-2 ">{name || file_name}</p>
            <div className="flex gap-3">
              <span className="px-1.5 py-1 rounded-lg bg-white border border-neutral-200    text-xs">
                {mime_type}
              </span>
              <span className="px-1.5 py-1 rounded-lg bg-white border border-neutral-200    text-xs">
                {formatBytes(size)}
              </span>
            </div>
          </div>
          <div>
            <IconButton
              size="small"
              sx={{ margin: "auto" }}
              onClick={() => onClear(id)}
            >
              <IoTrashOutline size={14} />
            </IconButton>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const SelectedMediaCell = <T,>({
  data,
  onClear,
  onReorder,
}: SelectedMediaCellProps<T>) => {
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
        <Droppable droppableId="media-items">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classNames({
                "grid grid-cols-1 mt-5 bg-white border border-slate-200   rounded-lg p-3 flex-wrap gap-3 duration-300":
                  true,
                "bg-green-100": snapshot.isDraggingOver,
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
                : ""}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ) : (
        ""
      )}
    </DragDropContext>
  );
};

export default SelectedMediaCell;


