import axios, { type AxiosResponse } from "axios";
import type { TaskGroup, Task } from "../../../types";

// ----- CONFIG -----
const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) throw new Error("VITE_API_URL is not defined");

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----- GENERIC SAFE REQUEST -----
const safeRequest = async <T>(request: Promise<AxiosResponse<T>>): Promise<T> => {
  try {
    const res = await request;
    return res.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error("API Axios error:", err.response?.data || err.message);
    } else {
      console.error("Unknown error:", err);
    }
    throw err;
  }
};

// ----- ENDPOINTS -----
export const fetchGroups = () =>
  safeRequest<TaskGroup[]>(api.get("/task-groups"));

export const createGroup = (title: string) =>
  safeRequest<TaskGroup>(api.post("/task-groups", { title }));

export const deleteGroup = (groupId: string) =>
  safeRequest<{ message: string }>(api.delete(`/task-groups/${groupId}`));

export const updateGroupTitle = (groupId: string, title: string) =>
  safeRequest<TaskGroup>(api.put(`/task-groups/${groupId}`, { title }));

export const reorderGroups = (groupIds: string[]) =>
  safeRequest<{ message: string }>(
    api.patch("/task-groups/order", { order: groupIds })
  );


// ----- TASKS ENDPOINTS -----
export const addTaskToGroup = async (groupId: string, title: string): Promise<void> => {
  await api.post(`/task-groups/${groupId}/tasks`, { title });
};

export const deleteTaskFromGroup = async (groupId: string, taskId: string): Promise<void> => {
  await api.delete(`/task-groups/${groupId}/tasks/${taskId}`);
};

export const toggleTaskCompleted = (groupId: string, taskId: string) =>
  safeRequest<Task>(api.put(`/task-groups/${groupId}/tasks/${taskId}/toggle`));

export const updateTaskTitle = async (groupId: string, taskId: string, title: string) => {
  const res = await api.put(`/task-groups/${groupId}/tasks/${taskId}/title`, { title });
  return res.data; // повинен бути { _id, title, completed }
};

export const reorderTasks = (groupId: string, taskIds: string[]) =>
  safeRequest<TaskGroup>(
    api.patch(`/task-groups/${groupId}/tasks/order`, { order: taskIds })
  );

  export const moveTaskToGroup = (sourceGroupId: string, taskId: string, targetGroupId: string) =>
  safeRequest<{ message: string }>(
    api.patch(`/task-groups/${sourceGroupId}/tasks/${taskId}/move/${targetGroupId}`)
  );
