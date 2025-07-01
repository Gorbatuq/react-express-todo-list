export type Task = {
  _id: string;
  title: string;
  completed: boolean;
};

export type TaskGroup = {
  _id: string;
  title: string;
  tasks: Task[];
};
