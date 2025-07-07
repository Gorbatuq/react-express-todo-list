import express from "express";
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  updateGroupTitle,
  reorderGroups,
} from "../controllers/taskGroupController";

import {
  createGroupSchema,
  reorderGroupsSchema,
  idParamSchema,
} from "../validation/taskSchemas";

import { validateBody, validateParams } from "../middleware/validate";

const router = express.Router();

// Get all groups
router.get("/", getAllGroups);

// Create a new group
router.post(
  "/",
  validateBody(createGroupSchema),
  createGroup
);

// Delete a group by ID
router.delete(
  "/:id",
  validateParams(idParamSchema),
  deleteGroup
);

// Update group title
router.put(
  "/:id",
  validateParams(idParamSchema),
  validateBody(createGroupSchema),
  updateGroupTitle
);

// Reorder groups
router.patch(
  "/order",
  validateBody(reorderGroupsSchema),
  reorderGroups
);

export default router;
