import { z } from "zod";
import ms from "ms";

const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(3000),

  MONGO_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),

  FRONTEND_ORIGIN: z.string().url(),

  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  MAIL_FROM: z.string().email(),

  COOKIE_SAMESITE: z.enum(["lax", "strict", "none"]).default("lax"),

  COOKIE_MAX_AGE: z
    .string()
    .regex(/^\d+\s*(ms|s|m|h|d|w|y)$/i)
    .default("7d"),

  RESET_TOKEN_TTL_MIN: z.coerce.number().default(15),
});

export const env = (() => {
  const raw = EnvSchema.parse(process.env);

  const cookieMaxAgeMs = ms(raw.COOKIE_MAX_AGE as ms.StringValue);
  if (typeof cookieMaxAgeMs !== "number") {
    throw new Error(
      "Invalid COOKIE_MAX_AGE (expected like '7d', '12h', '30m')"
    );
  }

  return { ...raw, COOKIE_MAX_AGE_MS: cookieMaxAgeMs };
})();
