import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";

import type { TaskGroup } from "@/types";

type Props = {
  groups: TaskGroup[];
};

export const TaskGroupGrid = ({ groups }: Props) => {
  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-sm text-center">
        No groups. Create first!!!
      </p>
    );
  }

  return (
    <Droppable droppableId="groups" type="group" direction="horizontal">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
           gap-6 items-start max-w-full"
        >
          {groups.map((group, index) => {
            return (
              <Draggable key={group.id} draggableId={group.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                  >
                    <TaskGroupCard group={group} />
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
