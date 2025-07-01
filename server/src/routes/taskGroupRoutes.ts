import express from "express";
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  updateGroupTitle,
  reorderGroups,
} from "../controllers/taskGroupController";

import { createGroupSchema, reorderGroupsSchema  } from "../validation/taskSchemas";
import { validate } from "../middleware/validate";

const router = express.Router();

router.get("/", getAllGroups);
router.post("/", validate(createGroupSchema), createGroup);
router.delete("/:id", deleteGroup);
router.put("/:id", updateGroupTitle);
router.patch("/order", validate(reorderGroupsSchema), reorderGroups);

export default router;
