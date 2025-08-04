import { Request, Response, NextFunction } from "express";
import { authService } from "../../services/authService";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";
import { setTokenCookie } from "../../services/authService";


const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";


export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user.id).select("email role createdAt");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      guest: user.role === "GUEST",// із payload
    });
  } catch (err) {
    next(err);
  }
};


export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.registerUser(email, password, res);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password, res);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = authService.logoutUser(res);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }

  
};

export const createGuest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.cookies?.token) {
      return res.status(400).json({ message: "Guest already has token" });
    }
    const random = Math.random().toString(36).substring(2, 10);
    const email = `guest_${random}@guest.local`;
    const password = await bcrypt.hash(random, 10);

    const user = new User({ email, password, role: "GUEST" });
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id.toString(), role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    setTokenCookie(res, token);

    res.status(201).json({ message: "Guest created" });
  } catch (err) {
    next(err);
  }
};
