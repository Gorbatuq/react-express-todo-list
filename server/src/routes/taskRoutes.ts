import express from "express";
import {
  addTask,
  deleteTask,
  moveTask,
  reorderTasks,
  toggleTask,
  updateTaskTitle,
} from "../controllers/taskController";

import { validate } from "../middleware/validate";
import {
  createTaskSchema,
  reorderTaskSchema,
  updateTaskTitleSchema,
} from "../validation/taskSchemas";

const router = express.Router({ mergeParams: true });

router.post("/:groupId/tasks", validate(createTaskSchema), addTask);
router.delete("/:groupId/tasks/:taskId", deleteTask);
router.put("/:groupId/tasks/:taskId/toggle", toggleTask);
router.put("/:groupId/tasks/:taskId/title", validate(updateTaskTitleSchema), updateTaskTitle);
router.patch("/:groupId/tasks/order", validate(reorderTaskSchema), reorderTasks);
router.patch("/:sourceGroupId/tasks/:taskId/move/:targetGroupId", moveTask);


export default router;
