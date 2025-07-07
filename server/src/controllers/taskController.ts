import { Request, Response, NextFunction } from "express";
import { TaskGroup } from "../models/TaskGroup";

// Add task to group
export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const newTask = {
      title: req.body.title.trim(),
      completed: false,
      order: group.tasks.length
    };

    group.tasks.push(newTask);
    await group.save();

    const createdTask = group.tasks.at(-1);
    res.status(201).json(createdTask);
  } catch (err) {
    next(err);
  }
};

// Delete task
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const initialLen = group.tasks.length;
    group.tasks = group.tasks.filter(task => task._id?.toString() !== req.params.taskId);

    if (group.tasks.length === initialLen)
      return res.status(404).json({ message: "Task not found" });

    group.tasks.forEach((task, index) => task.order = index);
    await group.save();

    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};

// Toggle task completion
export const toggleTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const task = group.tasks.find(task => task._id?.toString() === req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.completed = !task.completed;
    await group.save();

    res.json({ message: "Task toggled", task });
  } catch (err) {
    next(err);
  }
};

// Update task title
export const updateTaskTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const task = group.tasks.find(task => task._id?.toString() === req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title.trim();
    await group.save();

    res.json(task);
  } catch (err) {
    next(err);
  }
};


// Reorder tasks
export const reorderTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    const { order } = req.body;
    const idSet = new Set(order);

    group.tasks.sort((a, b) =>
      order.indexOf(a._id?.toString()) - order.indexOf(b._id?.toString())
    );

    // Ensure only provided IDs are reordered, others push to end
    group.tasks.forEach((task, index) => {
      if (idSet.has(task._id?.toString())) {
        task.order = index;
      }
    });

    await group.save();
    res.json({ message: "Tasks reordered", tasks: group.tasks });
  } catch (err) {
    next(err);
  }
};

// Move task between groups
export const moveTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sourceGroupId, taskId, targetGroupId } = req.params;

    const sourceGroup = await TaskGroup.findById(sourceGroupId);
    const targetGroup = await TaskGroup.findById(targetGroupId);

    if (!sourceGroup) return res.status(404).json({ message: "Source group not found" });
    if (!targetGroup) return res.status(404).json({ message: "Target group not found" });

    const taskIdx = sourceGroup.tasks.findIndex(task => task._id && task._id.toString() === taskId);
    if (taskIdx === -1) return res.status(404).json({ message: "Task not found in source group" });

    const [task] = sourceGroup.tasks.splice(taskIdx, 1);
    await sourceGroup.save();
    
    task.order = targetGroup.tasks.length;
    targetGroup.tasks.push(task);
    await targetGroup.save();

    res.json({ message: "Task moved" });
  } catch (err) {
    next(err);
  }
};

