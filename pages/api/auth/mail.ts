/* eslint-disable no-console */
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
  const authCode = createHash(randomDigits);
  let form;
  if (typeof email === "string" && validateEmail(email)) {
    renderFile(
      "./lib/form.ejs",
      { randomDigits, name: email.split("@")[0] },
      (err, data) => {
        form = data;
      },
    );
  }
  const transporter = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: process.env.EMAIL_SERVER_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
  await new Promise((resolve, reject) => {
    transporter.verify((error, success) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Server is ready");
        resolve(success);
      }
    });
  });

  const mailOptions = {
    from: "no_reply@allog.com",
    to: email,
    subject: "[Allog] 인증번호 안내 메일",
    html: form,
  };
  // eslint-disable-next-line consistent-return
  await new Promise(() => {
    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).send({ error: "failed to send email" });
      }
      return res.send({
        ok: 200,
        authCode,
      });
    });
  });
  return res.status(200).send({ error: "failed" });
}
