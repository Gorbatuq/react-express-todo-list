import type { UserDocument } from "../models/User";

export type UserDto = {
  id: string;
  email: string;
  role: "USER" | "GUEST";
  createdAt: string;
  taskCount: number;
};

export function toUserDto(
  u: Pick<UserDocument, "_id" | "email" | "role" | "createdAt" | "taskCount">
): UserDto {
  return {
    id: u._id.toString(),
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    taskCount: u.taskCount ?? 0,
  };
}
