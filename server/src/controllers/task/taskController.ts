import type { Request } from "express";
import { ok, created, noContent } from "../../http/response";
import { AppError } from "../../errors/AppError";
import {
  listTasksUsecase,
  createTaskUsecase,
  deleteTaskUsecase,
  updateTaskUsecase,
  reorderTasksUsecase,
  // importTasksUsecase,
} from "../../usecases/tasks";
import { asyncHandler } from "../../middleware/asyncHandler";

function userIdOrThrow(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
  return id;
}

export const getTasksByGroupId = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return ok(res, await listTasksUsecase(userId, req.params.groupId));
});

export const addTask = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return created(
    res,
    await createTaskUsecase(userId, req.params.groupId, req.body)
  );
});

export const deleteTask = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  await deleteTaskUsecase(userId, req.params.taskId);
  return noContent(res);
});

export const updateTask = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return ok(
    res,
    await updateTaskUsecase(
      userId,
      req.params.groupId,
      req.params.taskId,
      req.body
    )
  );
});

export const reorderTasks = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return ok(
    res,
    await reorderTasksUsecase(userId, req.params.groupId, req.body)
  );
});

// export const importTasks = asyncHandler(async (req, res) => {
//   const userId = userIdOrThrow(req);
//   return created(res, await importTasksUsecase(userId, req.body));
// });
