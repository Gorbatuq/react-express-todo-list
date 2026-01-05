import { env } from "../config/env";
import { mailer } from "./mailer";

export const authMailService = {
  async sendResetPasswordEmail(to: string, url: string) {
    await mailer.sendMail({
      from: env.MAIL_FROM,
      to,
      subject: "Reset password",
      text: `Reset password: ${url}`,
      html: `<p><a href="${url}">Reset password</a></p>`,
    });
  },
};
