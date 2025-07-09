import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../model/types";
import { FiX } from "react-icons/fi";
import { useGroupsContext } from "./contexts/GroupsContext";
import { useEditingContext } from "./contexts/EditingContext";

export const TaskItem = ({
  task,
  groupId,
  index,
}: {
  task: Task;
  groupId: string;
  index: number;
}) => {
  const { handlers } = useGroupsContext();
  const { editingTask, setEditingTask } = useEditingContext();

  const handleSubmitEdit = async () => {
    if (!editingTask) return;
    await handlers.updateTaskTitle(
      editingTask.groupId,
      editingTask.taskId,
      editingTask.title
    );
    handlers.reload?.();
    setEditingTask(null);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <li
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="flex items-center justify-between bg-gray-100 dark:bg-gray-500 rounded-lg px-3 py-2"
        >
          <div className="flex items-center gap-3 rounded px-2 py-1 flex-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handlers.handleToggleTask(groupId, task._id)}
            />
            {editingTask?.groupId === groupId &&
            editingTask?.taskId === task._id ? (
              <input
                value={editingTask.title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, title: e.target.value })
                }
                onBlur={handleSubmitEdit}
                onKeyDown={(e) => e.key === "Enter" && handleSubmitEdit()}
                autoFocus
                className="flex-1 bg-white"
              />
            ) : (
              <span
                onClick={() =>
                  setEditingTask({
                    groupId,
                    taskId: task._id,
                    title: task.title,
                  })
                }
                className="break-words w-0 flex-1"
              >
                {task.title}
              </span>
            )}
          </div>
          <button
            onClick={() =>
              handlers
                .deleteTaskFromGroup(groupId, task._id)
                .then(() => handlers.reload?.())
            }
            className="ml-3 bg-red-400 text-white rounded-full w-7 h-7 flex items-center justify-center"
          >
            <FiX />
          </button>
        </li>
      )}
    </Draggable>
  );
};
