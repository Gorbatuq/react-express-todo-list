import express from "express";
import {
  addTask,
  deleteTask,
  moveTask,
  reorderTasks,
  toggleTask,
  updateTaskTitle,
} from "../controllers/taskController";

import { validateBody, validateParams } from "../middleware/validate";
import {
  createTaskSchema,
  reorderTaskSchema,
  updateTaskTitleSchema,
  groupTaskParamsSchema,
  moveTaskParamsSchema,
  groupIdParamSchema,
} from "../validation/taskSchemas";

const router = express.Router({ mergeParams: true });

// Create a new task in a group
router.post(
  "/:groupId/tasks",
  validateParams(groupIdParamSchema),
  validateBody(createTaskSchema),
  addTask
);

// Delete a task from a group
router.delete(
  "/:groupId/tasks/:taskId",
  validateParams(groupTaskParamsSchema),
  deleteTask
);

// Toggle task completion status
router.put(
  "/:groupId/tasks/:taskId/toggle",
  validateParams(groupTaskParamsSchema),
  toggleTask
);

// Update task title
router.put(
  "/:groupId/tasks/:taskId/title",
  validateParams(groupTaskParamsSchema),
  validateBody(updateTaskTitleSchema),
  updateTaskTitle
);

// Reorder tasks inside a group
router.patch(
  "/:groupId/tasks/order",
  validateParams(groupIdParamSchema),
  validateBody(reorderTaskSchema),
  reorderTasks
);

// Move a task from one group to another
router.patch(
  "/:sourceGroupId/tasks/:taskId/move/:targetGroupId",
  validateParams(moveTaskParamsSchema),
  moveTask
);

export default router;
