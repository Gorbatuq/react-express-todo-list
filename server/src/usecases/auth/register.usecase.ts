import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { User } from "../../models/User";
import { toUserDto } from "../../dto/userDto";

const JWT_EXPIRES_IN = "7d";

export async function registerUsecase(body: {
  email: string;
  password: string;
}) {
  const email = String(body.email).trim().toLowerCase();
  const password = String(body.password);

  const existing = await User.findOne({ email }).lean();
  if (existing) throw new AppError(409, "USER_EXISTS", "User already exists");

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashed,
    role: "USER",
    lastLogin: new Date(),
  });

  const token = jwt.sign({ id: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user: toUserDto(user), token };
}
