import { useEffect, useMemo, useState } from "react";
import { useTaskStore } from "@/store/taskStore";

export const useTaskGroupCardLogic = (groupId: string) => {

  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");


  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]);
  const loadTasks = useTaskStore.getState().loadTasks;
  const addTask = useTaskStore((s) => s.addTask);

  useEffect(() => {
    if (!tasks) {
      void loadTasks(groupId);
    }
  }, [groupId, tasks, loadTasks]);


  const safeTasks = tasks || [];

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return safeTasks.filter((t) => !t.completed);
      case "completed":
        return safeTasks.filter((t) => t.completed);
      default:
        return safeTasks;
    }
  }, [filter, safeTasks]);

  const handleAdd = async (title: string) => {
    await addTask(groupId, title);
  };

  return {

    filter,
    setFilter,
    filteredTasks,
    handleAdd,
  };
};
