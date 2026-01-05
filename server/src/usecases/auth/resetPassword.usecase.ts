import bcrypt from "bcryptjs";
import { AppError } from "../../errors/AppError";
import { User } from "../../models/User";
import { PasswordResetToken } from "../../models/PasswordResetToken";
import { ResetTokenUtils } from "../../utils/ResetToken";

export async function resetPasswordUsecase(body: {
  token: string;
  newPassword: string;
}) {
  const tokenStr = String(body.token || "");
  const password = String(body.newPassword || "");

  if (!tokenStr) throw new AppError(400, "TOKEN_REQUIRED", "Token is required");
  if (password.length < 8)
    throw new AppError(
      400,
      "WEAK_PASSWORD",
      "Password must be at least 8 chars"
    );

  const tokenHash = ResetTokenUtils.hash(tokenStr);

  const resetDoc = await PasswordResetToken.findOne({
    tokenHash,
    usedAt: null,
    expiresAt: { $gt: new Date() },
  });

  if (!resetDoc)
    throw new AppError(400, "INVALID_RESET_TOKEN", "Invalid or expired token");

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
}
