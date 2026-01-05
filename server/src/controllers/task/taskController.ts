import type { Request, Response, NextFunction } from "express";
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

function userIdOrThrow(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
  return id;
}

export async function getTasksByGroupId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    return ok(res, await listTasksUsecase(userId, req.params.groupId));
  } catch (e) {
    next(e);
  }
}

export async function addTask(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = userIdOrThrow(req);
    return created(
      res,
      await createTaskUsecase(userId, req.params.groupId, req.body)
    );
  } catch (e) {
    next(e);
  }
}

export async function deleteTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    await deleteTaskUsecase(userId, req.params.taskId);
    return noContent(res);
  } catch (e) {
    next(e);
  }
}

export async function updateTask(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
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
  } catch (e) {
    next(e);
  }
}

export async function reorderTasks(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    return ok(
      res,
      await reorderTasksUsecase(userId, req.params.groupId, req.body)
    );
  } catch (e) {
    next(e);
  }
}

// export async function importTasks(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   try {
//     const userId = userIdOrThrow(req);
//     return created(res, await importTasksUsecase(userId, req.body));
//   } catch (e) {
//     next(e);
//   }
// }
