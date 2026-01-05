import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { AppError } from "../../errors/AppError";
import { User } from "../../models/User";
import { toUserDto } from "../../dto/userDto";

const JWT_EXPIRES_IN = "7d";

export async function loginUsecase(body: { email: string; password: string }) {
  const email = String(body.email).trim().toLowerCase();
  const password = String(body.password);

  const user = await User.findOne({ email }).select("+password");
  if (!user || !user.password) {
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");
  }

  const ok = await bcrypt.compare(password, user.password);
  if (!ok)
    throw new AppError(401, "INVALID_CREDENTIALS", "Invalid email or password");

  user.lastLogin = new Date();
  await user.save();

  const token = jwt.sign({ id: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user: toUserDto(user), token };
}
