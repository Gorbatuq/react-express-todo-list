import express from "express";
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  updateGroup,
  reorderGroups,
} from "../controllers/group/groupController";

import {
  createGroupSchema,
  reorderGroupsSchema,
  updateGroupSchema,
  groupIdParamSchema
} from "../validation/groupSchemas";


import { validateBody, validateParams } from "../middleware/validate";
import { authMiddleware } from "../middleware/authMiddleware";


const router = express.Router();

  router.get("/", authMiddleware, getAllGroups);
  router.post("/", authMiddleware, validateBody(createGroupSchema), createGroup);
  router.delete("/:groupId", authMiddleware, validateParams(groupIdParamSchema), deleteGroup);
  router.patch("/order", authMiddleware, validateBody(reorderGroupsSchema), reorderGroups);
  router.patch("/:groupId", authMiddleware, validateParams(groupIdParamSchema), validateBody(updateGroupSchema), updateGroup);

export default router;
