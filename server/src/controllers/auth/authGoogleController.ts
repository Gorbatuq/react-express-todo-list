import { AppError } from "../../errors/AppError";
import { asyncHandler } from "../../middleware/asyncHandler";
import { env } from "../../config/env";
import { getGoogleAuthUrl, makeState } from "../../services/googleOAuth";
import { googleLoginUsecase } from "../../usecases/auth";
import {
  setTokenCookie,
  setGoogleStateCookie,
  clearGoogleStateCookie,
} from "../../services/authCookies";

export const googleStart = asyncHandler(async (req, res) => {
  const state = makeState();
  setGoogleStateCookie(res, state);

  const url = getGoogleAuthUrl(state);

  return res.redirect(url);
});

export const googleCallback = asyncHandler(async (req, res) => {
  const code = String(req.query.code ?? "");
  const state = String(req.query.state ?? "");

  if (!code || !state)
    throw new AppError(400, "BAD_REQUEST", "Missing code/state");
  if (req.cookies?.g_state !== state)
    throw new AppError(401, "UNAUTHORIZED", "Bad state");

  const { token, user } = await googleLoginUsecase(code);
  setTokenCookie(res, token);
  clearGoogleStateCookie(res);

  if (req.query.debug === "1") {
    return res.status(200).json({
      ok: true,
      email: user.email,
      userId: user.id,
      tokenHead: token.slice(0, 20),
      cookiesInReq: req.headers.cookie ?? null,
    });
  }

  return res.redirect(`${env.FRONTEND_ORIGIN}/todo`); //take out
});
