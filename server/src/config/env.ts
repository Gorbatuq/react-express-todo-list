import { z } from "zod";

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
  RESET_TOKEN_TTL_MIN: z.coerce.number().default(15),
});

export const env = EnvSchema.parse(process.env);
