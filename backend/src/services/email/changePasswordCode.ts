import nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/sendmail-transport";
import fs from "fs";
import handlebars from "handlebars";

const emailTemplate = fs
  .readFileSync("./src/html/changePasswordCode.html", {
    flag: "r",
    encoding: "utf-8",
  })
  .toString();

export default function sendChangePasswordCode({
  email,
  code,
  username,
}: {
  email: string;
  code: string;
  username: string;
}) {
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
    changePasswordCode: code,
    username,
  };
  const htmlToSend = template(replacements);

  const mailOptions: MailOptions = {
    from: "kaycoder.lethanhtrung@gmail.com",
    to: email,
    subject: "Change password code",
    text: "Change password Email",
    html: htmlToSend,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error(err);
    }
    transporter.close();
  });
}
