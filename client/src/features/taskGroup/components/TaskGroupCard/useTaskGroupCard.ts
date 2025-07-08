import { useCallback, useMemo } from "react";
import type { TaskGroup } from "../../model/types";
import type { EditingGroup, Handlers, FilterType } from "./TaskGroupCard.types";

interface UseTaskGroupCardProps {
  group: TaskGroup;
  filter: Record<string, FilterType>;
  editingGroup: EditingGroup | null;
  handlers: Handlers;
  setEditingGroup: React.Dispatch<React.SetStateAction<EditingGroup | null>>;
}

export const useTaskGroupCard = ({
  group,
  filter,
  editingGroup,
  handlers,
  setEditingGroup,
}: UseTaskGroupCardProps) => {
  const isEditingGroup = editingGroup?.id === group._id;

  const filteredTasks = useMemo(() => {
    const currentFilter = filter[group._id] || "all";
    return group.tasks.filter((task) => {
      if (currentFilter === "completed") return task.completed;
      if (currentFilter === "active") return !task.completed;
      return true;
    });
  }, [filter, group]);

  const handleGroupEditSubmit = useCallback(async () => {
    if (!editingGroup) return;
    try {
      await handlers.updateGroupTitle(editingGroup.id, editingGroup.title);
      handlers.reload?.();
    } finally {
      setEditingGroup(null);
    }
  }, [editingGroup, handlers, setEditingGroup]);

  const handleDeleteGroup = useCallback(async () => {
    await handlers.deleteGroup(group._id);
    handlers.reload?.();
  }, [group, handlers]);

  return {
    isEditingGroup,
    filteredTasks,
    handleGroupEditSubmit,
    handleDeleteGroup,
  };
};
