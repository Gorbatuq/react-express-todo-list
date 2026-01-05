import type { TaskDocument } from "../models/Task";

export type TaskDto = {
  id: string;
  title: string;
  completed: boolean;
  order: number;
  groupId: string;
};

export function toTaskDto(
  t: Pick<TaskDocument, "_id" | "title" | "completed" | "order" | "groupId">
): TaskDto {
  return {
    id: t._id.toString(),
    title: t.title,
    completed: t.completed,
    order: t.order,
    groupId: t.groupId.toString(),
  };
}
