import express from "express";
import {
  getTasksByGroupId,
  addTask,
  reorderTasks,
  updateTask,
  deleteTask
} from "../controllers/task/taskController";

import { authMiddleware } from "../middleware/authMiddleware";
import { validateBody, validateParams } from "../middleware/validate";

import {
  createTaskSchema,
  reorderTaskSchema,
  updateTaskSchema
} from "../validation/taskSchemas";

import { groupAndTaskIdParamSchema } from "../validation/taskSchemas";
import { groupIdParamSchema } from "../validation/groupSchemas";


const router = express.Router({ mergeParams: true }); 


router.get("/", authMiddleware, validateParams(groupIdParamSchema), getTasksByGroupId);

router.post("/", authMiddleware, validateParams(groupIdParamSchema), validateBody(createTaskSchema), addTask);

router.patch("/order", authMiddleware, validateParams(groupIdParamSchema), validateBody(reorderTaskSchema), reorderTasks);

router.patch("/:taskId", authMiddleware, validateParams(groupAndTaskIdParamSchema), validateBody(updateTaskSchema), updateTask);

router.delete("/:taskId", authMiddleware, validateParams(groupAndTaskIdParamSchema), deleteTask);

export default router;
