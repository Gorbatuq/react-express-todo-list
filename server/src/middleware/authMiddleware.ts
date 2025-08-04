import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = {
      id: user._id.toString(),
      guest: user.role === "GUEST",
    };

    return next();
  } catch (err) {
    console.error("JWT verify error:", err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
