export type Task = {
  _id: string;
  title: string;
  completed: boolean;
   groupId: string;
};

export type TaskGroup = {
  _id: string;
  title: string;
  tasks: Task[];
};
