/* eslint-disable no-console */
import { render } from "ejs";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";
import { createHash, validateEmail } from "../../../lib/validation";

const html = `<html>
<body>
  <div style="font-family: Arial, Helvetica, sans-serif; width: 500px; margin: 0 auto; text-align: center; border: 1px solid #ccc; padding: 20px;">
    <h1 style="font-size: 24px;">회원가입 인증번호 안내<h1>
    <p style="font-weight: normal; font-size: 16px; margin: 0;"><span style="font-weight: bold"><%= name %></span>님 안녕하세요.</p>
    <p style="font-weight: normal; font-size: 16px; margin: 0;">아래의 인증번호를 입력하여 인증을 완료해주세요.</p>
    <span style="color: #0EA5E9; display: inline-block; border: 1px solid #0EA5E9; margin-top: 30px; padding: 10px 40px; font-weight: bold; font-size: 16px;"><%= randomDigits %></span>
  </div>
</body>
</html>`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { email } = req.query;
  const randomDigits = Math.random().toString().substring(2, 8);
  const authCode = createHash(randomDigits);
  let form;
  if (typeof email === "string" && validateEmail(email)) {
    form = render(html, { randomDigits, name: email.split("@")[0] });
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
