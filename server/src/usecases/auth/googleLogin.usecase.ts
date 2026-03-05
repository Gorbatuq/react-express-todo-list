import jwt from "jsonwebtoken";
import { env } from "../../config/env";
import { User } from "../../models/User";
import { toUserDto } from "../../dto/userDto";
import { exchangeCodeAndVerify } from "../../services/googleOAuth";

const JWT_EXPIRES_IN = "7d"; //take out

export async function googleLoginUsecase(code: string) {
  const g = await exchangeCodeAndVerify(code);

  let user = await User.findOne({ googleSub: g.sub });

  if (!user) {
    const byEmail = await User.findOne({ email: g.email });
    if (byEmail) {
      byEmail.googleSub = g.sub;
      byEmail.name = byEmail.name ?? g.name ?? undefined;
      byEmail.avatar = byEmail.avatar ?? g.avatar ?? undefined;
      byEmail.lastLogin = new Date();
      await byEmail.save();
      user = byEmail;
    } else {
      user = await User.create({
        email: g.email,
        googleSub: g.sub,
        name: g.name ?? undefined,
        avatar: g.avatar ?? undefined,
        role: "USER",
        lastLogin: new Date(),
      });
    }
  } else {
    user.lastLogin = new Date();
    await user.save();
  }

  if (!user) throw new Error("User is null after google login flow");
  const token = jwt.sign({ id: user._id.toString() }, env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  return { user: toUserDto(user), token };
}
