import { env } from "../../config/env";
import { User } from "../../models/User";
import { PasswordResetToken } from "../../models/PasswordResetToken";
import { ResetTokenUtils } from "../../utils/ResetToken";
import { authMailService } from "../../services/authMailService";

export async function forgotPasswordUsecase(body: { email: string }) {
  const email = String(body.email || "")
    .trim()
    .toLowerCase();
  const ok = { message: "If account exists, reset email was sent" };

  if (!email) return ok;

  const user = await User.findOne({ email }).select("_id email").lean();
  if (!user) return ok;

  const token = ResetTokenUtils.generate();
  const tokenHash = ResetTokenUtils.hash(token);

  const ttlMin = env.RESET_TOKEN_TTL_MIN;
  const expiresAt = new Date(Date.now() + ttlMin * 60_000);

  await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });

  const url = `${env.FRONTEND_ORIGIN}/reset-password?token=${encodeURIComponent(
    token
  )}`;
  await authMailService.sendResetPasswordEmail(user.email, url);

  return ok;
}
