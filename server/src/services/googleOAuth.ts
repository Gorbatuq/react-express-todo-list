// services/googleOAuth.ts
import crypto from "crypto";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env";

const client = new OAuth2Client(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_SECRET,
  env.GOOGLE_REDIRECT_URI,
);
const SCOPES = ["openid", "email", "profile"];

export function makeState(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getGoogleAuthUrl(state: string): string {
  return client.generateAuthUrl({
    scope: SCOPES,
    state,
    prompt: "select_account",
  });
}

export async function exchangeCodeAndVerify(code: string) {
  const { tokens } = await client.getToken(code);
  if (!tokens.id_token) throw new Error("No id_token");

  const ticket = await client.verifyIdToken({
    idToken: tokens.id_token,
    audience: env.GOOGLE_CLIENT_ID,
  });

  const p = ticket.getPayload();
  if (!p?.sub || !p.email) throw new Error("Bad payload");

  return {
    sub: p.sub,
    email: p.email.toLowerCase(),
    name: p.name ?? null,
    avatar: p.picture ?? null,
  };
}
