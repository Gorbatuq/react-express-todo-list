import type { Types } from "mongoose";

type GroupLean = {
  _id: Types.ObjectId;
  title: string;
  order: number;
  priority: 1 | 2 | 3 | 4;
};

export type GroupDto = {
  id: string;
  title: string;
  order: number;
  priority: 1 | 2 | 3 | 4;
};

export function toGroupDto(g: GroupLean): GroupDto {
  return {
    id: g._id.toString(),
    title: g.title,
    order: g.order,
    priority: g.priority,
  };
}
