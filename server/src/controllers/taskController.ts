import { Request, Response, NextFunction } from "express";
import { TaskGroup } from "../models/TaskGroup";

// Додати задачу
export const addTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) throw new Error("Групу не знайдено");

    group.tasks.push({ 
      title: req.body.title, 
      completed: false, 
      order: group.tasks.length // or use a different logic for order if needed
    });
    await group.save();

    const task = group.tasks[group.tasks.length - 1];
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

// Видалити задачу
export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) throw new Error("Групу не знайдено");

    const taskToRemove = group.tasks.find((t: any) => t._id?.toString() === req.params.taskId);
    if (!taskToRemove) throw new Error("Задачу не знайдено");

    group.tasks = group.tasks.filter((t: any) => t._id?.toString() !== req.params.taskId);
    await group.save();
    res.json(group);
  } catch (err) {
    next(err);
  }
};

// Змінити статус
export const toggleTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) throw new Error("Групу не знайдено");

    const task = group.tasks.find((t: any) => t._id?.toString() === req.params.taskId);
    if (!task) throw new Error("Задачу не знайдено");

    task.completed = !task.completed;  // <--- для гарантії
    await group.save();

    res.json({
      message: "Task toggled",
      updatedGroup: group
    });
  } catch (err) {
    next(err);
  }
};


// Оновити назву
export const updateTaskTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await TaskGroup.findById(req.params.groupId);
    if (!group) throw new Error("Групу не знайдено");

    const task = group.tasks.find((t: any) => t._id?.toString() === req.params.taskId);
    if (!task) throw new Error("Задачу не знайдено");

    task.title = req.body.title;
    await group.save();
    res.json(task); // повертаєш таску, не group
  } catch (err) {
    next(err);
  }
};


export const reorderTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;
    const { order } = req.body; // [taskId1, taskId2, ...]
    const group = await TaskGroup.findById(groupId);
    if (!group) throw new Error("Групу не знайдено");

    // Перебудуй tasks у новому порядку
    group.tasks.sort((a: any, b: any) =>
      order.indexOf(a._id?.toString()) - order.indexOf(b._id?.toString())
    );
    // Онови поле order для кожної таски
    group.tasks.forEach((task, idx) => (task.order = idx));
    await group.save();

    res.json(group);

  } catch (err) {
    next(err);
  }
};

export const moveTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sourceGroupId, taskId, targetGroupId } = req.params;
    const sourceGroup = await TaskGroup.findById(sourceGroupId);
    const targetGroup = await TaskGroup.findById(targetGroupId);

    if (!sourceGroup) throw new Error("Джерельну групу не знайдено");
    if (!targetGroup) throw new Error("Цільову групу не знайдено");

    const taskIdx = sourceGroup.tasks.findIndex((t: any) => t._id.toString() === taskId);
    if (taskIdx === -1) throw new Error("Таску не знайдено в джерельній групі");

    const [task] = sourceGroup.tasks.splice(taskIdx, 1);
    await sourceGroup.save();

    targetGroup.tasks.push({
      title: task.title,
      completed: task.completed,
      order: targetGroup.tasks.length
    });
    await targetGroup.save();

    res.json({ message: "Task moved" });
  } catch (err) {
    next(err);
  }
};
