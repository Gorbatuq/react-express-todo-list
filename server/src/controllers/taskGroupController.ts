import { Request, Response, NextFunction } from "express";
import { TaskGroup } from "../models/TaskGroup";

// Get all groups
export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await TaskGroup.find().sort({ order: 1 }).lean();
    res.json(groups);
  } catch (error) {
    next(error);
  }
};

// Create a new group
export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required and must be a string." });
    }

    const count = await TaskGroup.countDocuments();
    const newGroup = new TaskGroup({ title, order: count, tasks: [] });
    await newGroup.save();

    res.status(201).json(newGroup);
  } catch (error) {
    next(error);
  }
};

// Delete a group
export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await TaskGroup.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Group not found." });
    }
    res.json({ message: "Group deleted." });
  } catch (error) {
    next(error);
  }
};

// Update group title
export const updateGroupTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Title is required and must be a string." });
    }

    const updated = await TaskGroup.findByIdAndUpdate(
      req.params.id,
      { title },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Group not found." });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
};

// PATCH /groups/reorder
export const reorderGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { order } = req.body;
    if (!Array.isArray(order)) {
      return res.status(400).json({ message: "`order` must be an array of IDs." });
    }

    // Update orders in bulk
    await Promise.all(order.map((id, index) => 
      TaskGroup.findByIdAndUpdate(id, { order: index })
    ));

    const updatedGroups = await TaskGroup.find().sort({ order: 1 }).lean();
    res.json(updatedGroups);
  } catch (error) {
    next(error);
  }
};
