import { Task } from "../models/Task";
import { TaskGroupDocument } from "../models/TaskGroup";

export const toTaskResponse = (task: any) => ({
  _id: task._id.toString(),
  title: task.title,
  completed: task.completed,
  order: task.order,
});

export const toGroupResponse = (group: TaskGroupDocument) => ({
  id: group._id.toString(),
  title: group.title,
  order: group.order,
  priority: group.priority,
});
