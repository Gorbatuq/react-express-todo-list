import { Draggable } from "@hello-pangea/dnd";
import type { Task } from "../model/types";
import { FiX } from "react-icons/fi";

interface EditingTask {
  groupId: string;
  taskId: string;
  title: string;
}

interface TaskItemProps {
  task: Task;
  groupId: string;
  index: number;
  editingTask: EditingTask | null;
  setEditingTask: React.Dispatch<React.SetStateAction<EditingTask | null>>;
  handlers: {
    handleToggleTask: (groupId: string, taskId: string) => void;
    updateTaskTitle: (
      groupId: string,
      taskId: string,
      title: string
    ) => Promise<Task>;
    deleteTaskFromGroup: (
      groupId: string,
      taskId: string
    ) => Promise<{ message: string }>;
    reload?: () => void;
  };
}

export const TaskItem = ({
  task,
  groupId,
  index,
  editingTask,
  setEditingTask,
  handlers,
}: TaskItemProps) => {
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
          className="flex items-center justify-between bg-gray-100 rounded-lg px-3 py-2"
        >
          <div className="flex items-center gap-3 rounded px-2 py-1 flex-1">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {
                console.log("Toggle", groupId, task._id, "was", task.completed);
                handlers.handleToggleTask(groupId, task._id);
              }}
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
            onClick={() => {
              handlers
                .deleteTaskFromGroup(groupId, task._id)
                .then(() => handlers.reload?.());
            }}
            className="ml-3 bg-red-400 text-white rounded-full w-7 h-7 flex items-center justify-center"
          >
            <FiX />
          </button>
        </li>
      )}
    </Draggable>
  );
};
