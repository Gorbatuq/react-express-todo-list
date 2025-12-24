// routes/testMail.ts
import { Router } from "express";
import { mailer } from "../services/mailer";

const router = Router();

router.get("/test-email", async (req, res, next) => {
  try {
    const to =
      typeof req.query.to === "string" ? req.query.to : "YOUR_EMAIL@gmail.com";

    await mailer.sendMail({
      from: process.env.MAIL_FROM,
      to,
      subject: "FinTask GROOVE!",
      text: "If you see this — SMTP works",
    });

    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
});

export default router;
