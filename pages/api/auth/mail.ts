import { renderFile } from "ejs";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";
import { createHash, validateEmail } from "../../../lib/validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.query;
  const randomDigits = Math.random().toString().substring(2, 8);
  let authCode = "1234";
  authCode = createHash(randomDigits);
  let status = true;
  let form: string;
  if (typeof email === "string" && validateEmail(email)) {
    await new Promise((resolve, reject) => {
      renderFile(
        "./lib/form.ejs",
        { randomDigits, name: email.split("@")[0] },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            form = data;
            resolve(data);
          }
        },
      );
    }).then(async () => {
      const transporter = createTransport({
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      });
      const mailOptions = {
        from: "no_reply@allog.com",
        to: email,
        subject: "[Allog] 인증번호 안내 메일",
        html: form,
      };
      await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
          if (err) {
            reject(err);
            status = false;
          } else resolve(info);
        });
      });
    });
  }
  if (!status) {
    return res.status(500).send({ error: "failed to send email" });
  }
  return res.status(200).send({ ok: 200, authCode });
}
