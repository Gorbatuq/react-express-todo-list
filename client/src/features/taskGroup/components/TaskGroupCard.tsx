import { Droppable, Draggable } from "@hello-pangea/dnd";
import { TaskItem } from "./TaskItem";
import { AddTaskInput } from "./AddTaskInput";
import type { TaskGroup } from "../model/types";

type FilterType = "all" | "completed" | "active";

interface EditingGroup {
  id: string;
  title: string;
}

interface EditingTask {
  groupId: string;
  taskId: string;
  title: string;
}

interface Handlers {
  deleteGroup: (groupId: string) => Promise<{ message: string }>;
  addTaskToGroup: (groupId: string, title: string) => Promise<void>;
  updateGroupTitle: (groupId: string, title: string) => Promise<TaskGroup>;
  handleToggleTask: (groupId: string, taskId: string) => void;
  updateTaskTitle: (
    groupId: string,
    taskId: string,
    title: string
  ) => Promise<void>;
  deleteTaskFromGroup: (groupId: string, taskId: string) => Promise<void>;
  reload?: () => void;
}

interface Props {
  group: TaskGroup;
  index: number;
  taskTitles: Record<string, string>;
  setTaskTitles: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  filter: Record<string, FilterType>;
  setFilter: React.Dispatch<React.SetStateAction<Record<string, FilterType>>>;
  editingGroup: EditingGroup | null;
  setEditingGroup: React.Dispatch<React.SetStateAction<EditingGroup | null>>;
  editingTask: EditingTask | null;
  setEditingTask: React.Dispatch<React.SetStateAction<EditingTask | null>>;
  handlers: Handlers;
}

export const TaskGroupCard = ({
  group,
  index,
  taskTitles,
  setTaskTitles,
  filter,
  setFilter,
  editingGroup,
  setEditingGroup,
  editingTask,
  setEditingTask,
  handlers,
}: Props) => {
  const handleGroupEditSubmit = async () => {
    if (!editingGroup) return;
    try {
      await handlers.updateGroupTitle(editingGroup.id, editingGroup.title);
      handlers.reload?.();
    } finally {
      setEditingGroup(null);
    }
  };

  return (
    <Draggable draggableId={group._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="flex flex-col rounded-2xl bg-white dark:bg-zinc-700 shadow-lg p-4 transition-transform hover:scale-[1.02]"
        >
          <div
            className="flex justify-between items-center mb-4"
            {...provided.dragHandleProps}
          >
            {editingGroup?.id === group._id ? (
              <input
                value={editingGroup.title}
                onChange={(e) =>
                  setEditingGroup({ ...editingGroup, title: e.target.value })
                }
                onBlur={handleGroupEditSubmit}
                onKeyDown={(e) => e.key === "Enter" && handleGroupEditSubmit()}
                autoFocus
                className="flex-1 border rounded px-2 py-1"
              />
            ) : (
              <span
                className="text-lg font-semibold cursor-pointer truncate max-w-full break-words"
                onClick={() =>
                  setEditingGroup({ id: group._id, title: group.title })
                }
              >
                - {group.title} -
              </span>
            )}
            <button
              onClick={() => {
                handlers.deleteGroup(group._id).then(() => handlers.reload?.());
              }}
              className="ml-3 text-red-600 text-xl"
            >
              ×
            </button>
          </div>

          <Droppable droppableId={group._id} type="task">
            {(provided) => (
              <ul
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-2 mb-4"
              >
                {group.tasks
                  .filter((task) => {
                    const f = filter[group._id] || "all";
                    if (f === "completed") return task.completed;
                    if (f === "active") return !task.completed;
                    return true;
                  })
                  .map((task, idx) => (
                    <TaskItem
                      key={task._id}
                      task={task}
                      groupId={group._id}
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

          <AddTaskInput
            groupId={group._id}
            value={taskTitles[group._id] || ""}
            onChange={(val) =>
              setTaskTitles((prev) => ({ ...prev, [group._id]: val }))
            }
            onAdd={async (groupId, title) => {
              await handlers.addTaskToGroup(groupId, title);
            }}
            reload={handlers.reload ?? (() => {})}
          />

          <div className="flex justify-center mt-3 space-x-3">
            <button
              className="text-sm underline"
              onClick={() =>
                setFilter((prev) => ({ ...prev, [group._id]: "all" }))
              }
            >
              all
            </button>
            <button
              className="text-sm underline"
              onClick={() =>
                setFilter((prev) => ({ ...prev, [group._id]: "completed" }))
              }
            >
              completed
            </button>
            <button
              className="text-sm underline"
              onClick={() =>
                setFilter((prev) => ({ ...prev, [group._id]: "active" }))
              }
            >
              active
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
};
