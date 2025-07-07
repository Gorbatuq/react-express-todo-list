import { DragDropContext } from "@hello-pangea/dnd";
import { AddGroupForm } from "./AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { useTaskGroups } from "../hooks/useTaskGroup";
import { groupApi } from "../api/groups";
import { taskApi } from "../api/task";

export const TaskGroupList = () => {
  const {
    groups,
    loading,
    reload,
    taskTitles,
    setTaskTitles,
    filter,
    setFilter,
    editingGroup,
    setEditingGroup,
    editingTask,
    setEditingTask,
    handleToggleTask,
    onDragEnd,
  } = useTaskGroups();

  if (loading) return <p>Loading...</p>;

  return (
    <div className="sm:px-6 md:px-8 max-w-7xl mx-auto">
      <AddGroupForm onCreate={() => reload?.()} />
      <DragDropContext onDragEnd={onDragEnd}>
        <TaskGroupGrid
          groups={groups}
          taskTitles={taskTitles}
          setTaskTitles={setTaskTitles}
          filter={filter}
          setFilter={setFilter}
          editingGroup={editingGroup}
          setEditingGroup={setEditingGroup}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          handlers={{
            reload,
            handleToggleTask,
            deleteGroup: (id) => groupApi.delete(id),
            updateGroupTitle: (id, title) => groupApi.updateTitle(id, title),
            addTaskToGroup: (id, title) => taskApi.add(id, title),
            deleteTaskFromGroup: (id, taskId) => taskApi.delete(id, taskId),
            updateTaskTitle: (id, taskId, title) =>
              taskApi.updateTitle(id, taskId, title),
          }}
        />
      </DragDropContext>
    </div>
  );
};
