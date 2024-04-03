import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import fs from "fs";
import handlebars from "handlebars";

const emailTemplate = fs
  .readFileSync("./src/html/verificationCode.html", {
    flag: "r",
    encoding: "utf-8",
  })
  .toString();

export default function SendVerificationCode({ email, code }: { email: string; code: string }) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.email",
    secure: false,
    service: "gmail",
    auth: {
      user: "kaycoder.lethanhtrung@gmail.com",
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const template = handlebars.compile(emailTemplate);
  const replacements = {
    verificationcode: code,
  };
  const htmlToSend = template(replacements);

  const mailOptions: MailOptions = {
    from: "kaycoder.lethanhtrung@gmail.com",
    to: email,
    subject: "Verification code for register",
    text: "Verification Email",
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    }
    transporter.close();
  });
}
