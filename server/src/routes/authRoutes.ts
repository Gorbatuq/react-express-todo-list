import express from "express";
import { register, login, logout, getMe } from "../controllers/auth/authController";
import { validateBody } from "../middleware/validate";
import { authSchema } from "../validation/authSchema";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/me", authMiddleware, getMe);
router.post("/register", validateBody(authSchema), register);
router.post("/login", validateBody(authSchema), login);
router.post("/logout", logout);

export default router;
