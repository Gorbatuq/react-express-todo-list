import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { ResetTokenUtils } from "../utils/ResetToken";
import { PasswordResetToken } from "../models/PasswordResetToken";
import { authMailService } from "./authMailService";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const JWT_EXPIRES_IN = "7d";

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

function generateToken(userId: string) {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function setTokenCookie(res: Response, token: string) {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const authService = {
  async registerUser(email: string, password: string, res: Response) {
    try {
      const existing = await User.findOne({ email });
      if (existing) throw new AppError("User already exists", 409);

      const hashed = await bcrypt.hash(password, 10);
      const user = new User({ email, password: hashed });
      user.lastLogin = new Date();

      console.log("Saving user:", email);
      await user.save();

      const token = generateToken(user._id.toString());
      setTokenCookie(res, token);

      return { message: "User registered" };
    } catch (err: any) {
      // duplicate email processing
      if (err.code === 11000) {
        throw new AppError("User already exists", 409);
      }

      console.error("register User error:", err);
      throw new AppError("Registration failed", 500);
    }
  },

  async loginUser(email: string, password: string, res: Response) {
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      throw new AppError("Invalid email or password", 401);
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AppError("Invalid email or password", 401);

    user.lastLogin = new Date();
    await user.save();
    const token = generateToken(user._id.toString());
    setTokenCookie(res, token);

    return { message: "Login successful" };
  },

  logoutUser(res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return { message: "Logout successful" };
  },

  async forgotPassword(email: string) {
    const emailNormalized = String(email || "")
      .trim()
      .toLowerCase();

    const ok = { message: "If account exists, reset email was sent" };
    if (!emailNormalized) return ok;

    const user = await User.findOne({ email: emailNormalized })
      .select("_id email")
      .lean();
    if (!user) return ok;

    const token = ResetTokenUtils.generate();
    const tokenHash = ResetTokenUtils.hash(token);

    const ttlMin = Number(process.env.RESET_TOKEN_TTL_MIN || 15);
    const expiresAt = new Date(Date.now() + ttlMin * 60_000);

    await PasswordResetToken.create({
      userId: user._id,
      tokenHash,
      expiresAt,
    });

    const origin = process.env.FRONTEND_ORIGIN;
    if (!origin) throw new AppError("FRONTEND_ORIGIN is missing", 500);

    const url = `${origin}/reset-password?token=${encodeURIComponent(token)}`;
    await authMailService.sendResetPasswordEmail(user.email, url);

    return ok;
  },

  async resetPassword(token: string, newPassword: string) {
    const tokenStr = String(token || "");
    const password = String(newPassword || "");

    if (!tokenStr) throw new AppError("Token is required", 400);
    if (password.length < 8)
      throw new AppError("Password must be at least 8 chars", 400);

    const tokenHash = ResetTokenUtils.hash(tokenStr);

    const resetDoc = await PasswordResetToken.findOne({
      tokenHash,
      usedAt: null,
      expiresAt: { $gt: new Date() },
    });

    if (!resetDoc) throw new AppError("Invalid or expired token", 400);

    const hashed = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: resetDoc.userId },
      { $set: { password: hashed } }
    );

    resetDoc.usedAt = new Date();
    await resetDoc.save();

    await PasswordResetToken.updateMany(
      { userId: resetDoc.userId, usedAt: null },
      { $set: { usedAt: new Date() } }
    );

    return { message: "Password updated" };
  },
};
