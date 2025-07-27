import { useEffect, useMemo, useState } from "react";
import { useTaskStore } from "@/store/taskStore";

export const useTaskGroupCardLogic = (groupId: string) => {
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // ⚠️ не використовуй || [] — це міняє reference кожного разу
  const tasks = useTaskStore((s) => s.tasksByGroup[groupId]);
  const loadTasks = useTaskStore.getState().loadTasks;
  const addTask = useTaskStore((s) => s.addTask);

  // 🧠 безпечний useEffect — викликає loadTasks лише якщо ще не було
  useEffect(() => {
    if (!tasks) {
      void loadTasks(groupId);
    }
  }, [groupId, tasks, loadTasks]);

  // 🧼 окрема змінна — гарантує що це точно масив
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
    title,
    setTitle,
    filter,
    setFilter,
    filteredTasks,
    handleAdd,
  };
};
