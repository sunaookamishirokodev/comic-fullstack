const bcrypt = require("bcrypt");
import Elysia, { t } from "elysia";
import validator from "validator";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import SendVerificationCode from "../../../services/email/verificationCode";
import genCode from "../../../util/gen/genCode";
import setExpires from "../../../util/set/setExpires";

export const register = new Elysia().post(
  "/register",
  async ({ body: { email, password, username, displayName } }) => {
    // Validator
    if (!validator.isEmail(email)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid email" });
    }
    if (!validator.isStrongPassword(password)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid password" });
    }

    const usernameExist = await prisma.author.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });

    if (usernameExist) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Username exist" });
    }

    const emailExist = await prisma.author.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
      },
    });

    if (emailExist) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Email exist" });
    }

    // handle success
    const encryptPassword = await bcrypt.hash(password, 10);
    const code = genCode();

    SendVerificationCode({ email, code });

    const data = await prisma.author.create({
      data: {
        email,
        password: encryptPassword,
        displayName,
        username,
        verification: {
          create: {
            code,
            expiredAt: setExpires("5m"),
          },
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    return ReturnData({
      status: ResponseStatus["CREATED"],
      message: "Created account successfully, please check your email to get verification code",
      data,
    });
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      username: t.String(),
      displayName: t.String(),
    }),
  }
);
