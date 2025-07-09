import { useCallback, useMemo } from "react";
import type { TaskGroup } from "../../model/types";
import type { EditingGroup, Handlers, FilterType } from "./TaskGroupCard.types";

interface UseTaskGroupCardProps {
  group: TaskGroup;
  currentFilter: FilterType; 
  editingGroup: EditingGroup | null;
  handlers: Handlers;
  setEditingGroup: React.Dispatch<React.SetStateAction<EditingGroup | null>>;
}

export const useTaskGroupCard = ({
  group,
  currentFilter,
  editingGroup,
  handlers,
  setEditingGroup,
}: UseTaskGroupCardProps) => {
  const isEditingGroup = editingGroup?.id === group._id;


  const filteredTasks = useMemo(() => {
    if (currentFilter === "completed") return group.tasks.filter(t => t.completed);
    if (currentFilter === "active") return group.tasks.filter(t => !t.completed);
    return group.tasks;
  }, [currentFilter, group]);

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
