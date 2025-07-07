import { Droppable } from "@hello-pangea/dnd";
import { TaskItem } from "../TaskItem";
import type { Task } from "../../model/types";
import type { EditingTask, Handlers } from "./TaskGroupCard.types";

interface Props {
  groupId: string;
  tasks: Task[];
  editingTask: EditingTask | null;
  setEditingTask: React.Dispatch<React.SetStateAction<EditingTask | null>>;
  handlers: Handlers;
}

export const TaskList = ({
  groupId,
  tasks,
  editingTask,
  setEditingTask,
  handlers,
}: Props) => (
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
            editingTask={editingTask}
            setEditingTask={setEditingTask}
            handlers={handlers}
          />
        ))}
        {provided.placeholder}
      </ul>
    )}
  </Droppable>
);
