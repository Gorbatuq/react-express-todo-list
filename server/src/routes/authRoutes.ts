import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  createGuest,
  forgotPassword,
  resetPassword,
} from "../controllers/auth/authController";
import { validateBody } from "../middleware/validate";
import { authSchema } from "../validation/authSchema";
import { authMiddleware } from "../middleware/authMiddleware";
import rateLimit from "express-rate-limit";

const router = express.Router();

const guestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: "Too many attempts. Try again later.",
});

const forgotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many reset attempts. Try again later.",
});

router.get("/me", authMiddleware, getMe);

router.post("/register", validateBody(authSchema), register);
router.post("/login", validateBody(authSchema), login);
router.post("/logout", logout);
router.post("/guest", guestLimiter, createGuest);

router.post("/forgot-password", forgotLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
