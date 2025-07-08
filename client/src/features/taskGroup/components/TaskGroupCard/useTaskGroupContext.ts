import { useContext } from "react";
import { TaskGroupContext } from "../contexts/TaskGroupContext";

export const useTaskGroupContext = () => {
  const context = useContext(TaskGroupContext);
  if (!context) {
    throw new Error("useTaskGroupContext must be used within a TaskGroupProvider");
  }
  return context;
};
