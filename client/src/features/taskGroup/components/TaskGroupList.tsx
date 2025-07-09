import { DragDropContext } from "@hello-pangea/dnd";
import { AddGroupForm } from "./AddGroupForm";
import { TaskGroupGrid } from "./TaskGroupGrid";
import { useTaskGroups } from "../hooks/useTaskGroup";
import { GroupsProvider } from "./contexts/GroupsContext";
import { EditingProvider } from "./contexts/EditingContext";
import { groupApi } from "../api/groups";
import { taskApi } from "../api/task";

export const TaskGroupList = () => {
  const {
    groups,
    setGroups,
    loading,
    reload,
    editingGroup,
    setEditingGroup,
    editingTask,
    setEditingTask,
    handleToggleTask,
    onDragEnd,
  } = useTaskGroups();

  const handlers = {
    reload,
    handleToggleTask,
    deleteGroup: (id: string) => groupApi.delete(id),
    updateGroupTitle: (id: string, title: string) =>
      groupApi.updateTitle(id, title),
    addTaskToGroup: (id: string, title: string) => taskApi.add(id, title),
    deleteTaskFromGroup: (id: string, taskId: string) =>
      taskApi.delete(id, taskId),
    updateTaskTitle: (id: string, taskId: string, title: string) =>
      taskApi.updateTitle(id, taskId, title),
  };

  if (loading) return <p>Loading...</p>;

  return (
    <GroupsProvider value={{ groups, setGroups, handlers }}>
      <EditingProvider
        value={{ editingGroup, setEditingGroup, editingTask, setEditingTask }}
      >
        <div className="sm:px-6 md:px-8 max-w-7xl mx-auto">
          <AddGroupForm onCreate={reload ?? (() => {})} />
          <DragDropContext onDragEnd={onDragEnd}>
            <TaskGroupGrid />
          </DragDropContext>
        </div>
      </EditingProvider>
    </GroupsProvider>
  );
};
