import { Request, Response, NextFunction } from "express";
import { groupService } from "../../services/groupService";

export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await groupService.getAllGroups(req.user.id);
    res.json(groups);
  } catch (err) {
    next(err);
  }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupService.createGroup(req.body.title, req.user.id);
    res.status(201).json(group);
  } catch (err) {
    next(err);
  }
};

export const deleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await groupService.deleteGroup(req.params.groupId, req.user.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const updateGroupTitle = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupService.updateGroupTitle(req.params.groupId, req.body.title, req.user.id);
    res.json(group);
  } catch (err) {
    next(err);
  }
};

export const reorderGroups = async (req: Request, res: Response, next: NextFunction) => {
  console.log("ORDER FROM BODY", req.body.order);
  try {
    const updated = await groupService.reorderGroups(req.body.order, req.user.id);
    res.json(updated);
      console.log("ORDER FROM BODY", req.body.order);
  } catch (err) {
    next(err);
      console.log("ORDER FROM BODY", req.body.order);
  }
};
