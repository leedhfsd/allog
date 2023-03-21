import { renderFile } from "ejs";
import { NextApiRequest, NextApiResponse } from "next";
import { createTransport } from "nodemailer";
import { validateEmail } from "../../../lib/validation";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.query;
  const authCode = Math.random().toString().substring(2, 8);
  let status = true;
  let form;
  if (typeof email === "string" && validateEmail(email)) {
    renderFile(
      "./lib/form.ejs",
      { authCode, name: email.split("@")[0] },
      (err, data) => {
        form = data;
        const transporter = createTransport({
          host: process.env.EMAIL_SERVER_HOST,
          port: process.env.EMAIL_SERVER_PORT,
          secure: true,
          auth: {
            user: process.env.EMAIL_SERVER_USER,
            pass: process.env.EMAIL_SERVER_PASSWORD,
          },
        });
        const mailOptions = {
          from: "leedhfsd@gmail.com",
          to: email,
          subject: "[Allog] 인증번호 안내 메일",
          html: form,
        };

        transporter.sendMail(mailOptions, (e) => {
          if (e) {
            status = false;
          }
        });
        if (!status) {
          return res.status(500).send({ error: "failed to send email" });
        }
        return res.status(200).send({ ok: "Mail send completed" });
      },
    );
  }
}
