import type { Request } from "express";
import { ok, created, noContent } from "../../http/response";
import { AppError } from "../../errors/AppError";
import {
  createGroupUsecase,
  listGroupsUsecase,
  deleteGroupUsecase,
  updateGroupUsecase,
  reorderGroupsUsecase,
} from "../../usecases/groups";
import { asyncHandler } from "../../middleware/asyncHandler";

function userIdOrThrow(req: Request): string {
  const id = req.user?.id;
  if (!id) throw new AppError(401, "UNAUTHORIZED", "Unauthorized");
  return id;
}

export const getAllGroups = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return ok(res, await listGroupsUsecase(userId));
});

export const createGroup = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return created(res, await createGroupUsecase(userId, req.body));
});

export const deleteGroup = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  await deleteGroupUsecase(userId, req.params.groupId);
  return noContent(res);
});

export const updateGroup = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return ok(
    res,
    await updateGroupUsecase(userId, req.params.groupId, req.body)
  );
});

export const reorderGroups = asyncHandler(async (req, res) => {
  const userId = userIdOrThrow(req);
  return ok(res, await reorderGroupsUsecase(userId, req.body));
});
