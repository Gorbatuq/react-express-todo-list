import type { Types } from "mongoose";

type GroupLean = {
  _id: Types.ObjectId;
  title: string;
  order: number;
  priority: 1 | 2 | 3 | 4;
  createdAt?: Date;
  updatedAt?: Date;
};

export type GroupDto = {
  id: string;
  title: string;
  order: number;
  priority: 1 | 2 | 3 | 4;
  createdAt: string;
  updatedAt: string;
};

export function toGroupDto(g: GroupLean): GroupDto {
  const fallbackDate = g._id.getTimestamp();
  const createdAt = g.createdAt ?? fallbackDate;
  const updatedAt = g.updatedAt ?? createdAt;

  return {
    id: g._id.toString(),
    title: g.title,
    order: g.order,
    priority: g.priority,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  };
}
