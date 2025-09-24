import { Droppable } from "@hello-pangea/dnd";
import { TaskItem } from "../TaskItem/TaskItem";
import type { Task } from "../../../../types";

interface Props {
  groupId: string;
  tasks: Task[];
  onToggle: (taskId: string, completed: boolean) => void;
  onDelete: (taskId: string) => void;
  onEditSubmit: (taskId: string, title: string) => void;
}

export const TaskList = ({
  groupId,
  tasks,
  onToggle,
  onDelete,
  onEditSubmit,
}: Props) => {
  return (
    <Droppable droppableId={groupId} type="task">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col gap-2 mb-4"
        >
          {tasks.map((task, index) => (
            <TaskItem
              key={task.id}
              task={task}
              index={index}
              onToggle={onToggle}
              onDelete={onDelete}
              onEditSubmit={onEditSubmit}
            />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};
