export type Priority = 1 | 2 | 3 | 4;

export type User = {
  id: string;
  email: string;
  role: "USER" | "GUEST";
  createdAt: string;
  taskCount?: number;
};


export type Task = {
  _id: string;
  title: string;
  completed: boolean;
  order: number;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  priority: Priority;
};

export type TaskGroup = {
  _id: string;
  title: string;
  order: number;
  priority: Priority;
  userId: string;
};
