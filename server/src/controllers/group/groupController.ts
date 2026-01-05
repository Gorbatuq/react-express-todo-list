import type { Request, Response, NextFunction } from "express";
import { ok, created, noContent } from "../../http/response";
import { AppError } from "../../errors/AppError";
import {
  createGroupUsecase,
  listGroupsUsecase,
  deleteGroupUsecase,
  updateGroupUsecase,
  reorderGroupsUsecase,
} from "../../usecases/groups";

function userIdOrThrow(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
  return id;
}

export async function getAllGroups(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    return ok(res, await listGroupsUsecase(userId));
  } catch (e) {
    next(e);
  }
}

export async function createGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    return created(res, await createGroupUsecase(userId, req.body));
  } catch (e) {
    next(e);
  }
}

export async function deleteGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    await deleteGroupUsecase(userId, req.params.groupId);
    return noContent(res);
  } catch (e) {
    next(e);
  }
}

export async function updateGroup(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    return ok(
      res,
      await updateGroupUsecase(userId, req.params.groupId, req.body)
    );
  } catch (e) {
    next(e);
  }
}

export async function reorderGroups(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = userIdOrThrow(req);
    return ok(res, await reorderGroupsUsecase(userId, req.body));
  } catch (e) {
    next(e);
  }
}
