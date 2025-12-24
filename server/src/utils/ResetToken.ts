import crypto from "crypto";

export const ResetTokenUtils = {
  generate(): string {
    return crypto.randomBytes(32).toString("base64url");
  },
  hash(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  },
};
