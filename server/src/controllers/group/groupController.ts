import { Request, Response, NextFunction } from "express";
import { groupService } from "../../services/groupService";
import { toGroupResponse } from "../../utils/toResponse";

export const getAllGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await groupService.getAllGroups(req.user.id);
    res.json(groups.map(toGroupResponse));
  } catch (err) {
    next(err);
  }
};

export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const priority = req.body.priority ?? 2;
    const group = await groupService.createGroup(
      req.body.title,
      priority,
      req.user.id
    );

    res.status(201).json(toGroupResponse(group)); 

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

export const updateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupService.updateGroup(req.params.groupId, req.user.id, req.body);
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
