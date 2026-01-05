import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { User } from "../../models/User";
import { toUserDto } from "../../dto/userDto";

const JWT_EXPIRES_IN = "7d";

export async function createGuestUsecase() {
  const random = Math.random().toString(36).slice(2, 10);
  const email = `guest_${random}@guest.local`;
  const hashed = await bcrypt.hash(random, 10);

  const user = await User.create({
    email,
    password: hashed,
    role: "GUEST",
    lastLogin: new Date(),
  });

  const token = jwt.sign({ id: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user: toUserDto(user), token };
}
