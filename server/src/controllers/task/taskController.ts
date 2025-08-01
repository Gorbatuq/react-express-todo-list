import { Request, Response, NextFunction } from "express";
import { taskService } from "../../services/taskService";
import { toTaskResponse } from "../../utils/toResponse";

// GET /groups/:groupId/tasks
export const getTasksByGroupId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getTasksByGroupId(req.params.groupId, req.user.id);
    res.json(tasks.map(toTaskResponse));
  } catch (err) {
    next(err);
  }
};

// POST /groups/:groupId/tasks
export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.body.title, req.params.groupId, req.user.id);
    res.status(201).json(toTaskResponse(task));
  } catch (err) {
    next(err);
  }
};

// DELETE /groups/:groupId/tasks/:taskId
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await taskService.deleteTask(req.params.taskId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

// PATCH /groups/:groupId/tasks/:taskId
export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask({
      taskId: req.params.taskId,
      groupId: req.params.groupId,
      userId: req.user.id,
      updates: req.body, // { title?, completed?, groupId? }
    });

    res.json(toTaskResponse(task));
  } catch (err) {
    next(err);
  }
};

// PATCH /groups/:groupId/tasks/order
export const reorderTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await taskService.reorderTasks(req.body.order, req.params.groupId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
