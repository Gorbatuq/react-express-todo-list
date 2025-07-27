import { Droppable } from "@hello-pangea/dnd";
import { TaskItem } from "../TaskItem/TaskItem";
import type { Task } from "../../model/types";
import { useTaskStore } from "@/store/taskStore";

interface Props {
  groupId: string;
  tasks: Task[];
}

export const TaskList = ({ groupId, tasks }: Props) => {
  const toggleTask = useTaskStore((s) => s.toggle);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const updateTitle = useTaskStore((s) => s.updateTitle);

  return (
    <Droppable droppableId={groupId} type="task">
      {(provided) => (
        <ul
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="space-y-2 mb-4"
        >
          {tasks.map((task, index) => (
            <TaskItem
              key={task._id}
              task={task}
              groupId={groupId}
              index={index}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onEditSubmit={updateTitle}
            />
          ))}
          {provided.placeholder}
        </ul>
      )}
    </Droppable>
  );
};
