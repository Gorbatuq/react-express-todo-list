import { Droppable } from "@hello-pangea/dnd";
import { TaskItem } from "../TaskItem";
import type { Task } from "../../model/types";

export const TaskList = ({
  groupId,
  tasks,
}: {
  groupId: string;
  tasks: Task[];
}) => {
  return (
    <Droppable droppableId={groupId} type="task">
      {(provided) => (
        <ul
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-2 mb-4"
        >
          {tasks.map((task, idx) => (
            <TaskItem
              key={task._id}
              task={task}
              groupId={groupId}
              index={idx}
            />
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};
