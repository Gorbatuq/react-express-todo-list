import { Request, Response, NextFunction } from "express";
import { TaskGroup } from "../models/TaskGroup";

// Отримати всі групи
export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await TaskGroup.find().sort({ order: 1 });
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

// Створити нову групу
export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const count = await TaskGroup.countDocuments();
    const newGroup = new TaskGroup({ title, order: count, tasks: [] });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    next(err);
  }
};

// Видалити групу
export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await TaskGroup.findByIdAndDelete(req.params.id);
    res.json({ message: "Групу видалено" });
  } catch (err) {
    next(err);
  }
};

// Оновити назву групи
export const updateGroupTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    const updated = await TaskGroup.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );
    if (!updated) throw new Error("Групу не знайдено");
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

// PATCH /groups/reorder
export const reorderGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order } = req.body; // ["groupId1", "groupId2", ...]
    const groups = await TaskGroup.find({ _id: { $in: order } }) as (typeof TaskGroup.prototype & { _id: any, order?: number })[];

    for (let i = 0; i < order.length; i++) {
      const group = groups.find((g) => (g._id as any).toString() === order[i]);
      if (group) {
        group.order = i;
        await group.save();
      }
    }
    res.json(await TaskGroup.find().sort({ order: 1 }));
  } catch (err) {
    next(err);
  }
};
