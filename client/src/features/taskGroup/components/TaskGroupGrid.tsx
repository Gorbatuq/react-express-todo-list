import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskGroupCard } from "./TaskGroupCard/TaskGroupCard";
import { TaskGroup } from "../../../types";
import { getDropAnimationStyle } from "../utils/getDropAnimationStyle";

type Props = {
  groups: TaskGroup[];
};

export const TaskGroupGrid = ({ groups }: Props) => {
  if (groups.length === 0) {
    return (
      <p className="text-gray-500 text-lg text-center">
        No groups. Create first group !
      </p>
    );
  }

  return (
    <Droppable droppableId="groups" type="group" direction="horizontal">
      {(droppableProvided) => (
        <div
          ref={droppableProvided.innerRef}
          {...droppableProvided.droppableProps}
          className="grid w-full grid-cols-1 items-start gap-6 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4"
        >
          {groups.map((group, index) => {
            return (
              <Draggable key={group.id} draggableId={group.id} index={index}>
                {(droppableProvided, snapshot) => (
                  <div
                    ref={droppableProvided.innerRef}
                    {...droppableProvided.draggableProps}
                    style={getDropAnimationStyle(
                      droppableProvided.draggableProps.style,
                      snapshot,
                    )}
                    className="min-w-0"
                  >
                    <TaskGroupCard
                      group={group}
                      dragHandleProps={droppableProvided.dragHandleProps}
                    />
                  </div>
                )}
              </Draggable>
            );
          })}
          {droppableProvided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
