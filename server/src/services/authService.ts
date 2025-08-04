import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";

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
    if (!user) throw new AppError("Invalid email or password", 401);

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
};
