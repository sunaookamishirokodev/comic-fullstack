import * as argon2 from "argon2";
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
  async ({
    body: { email, password, username, displayName },
  }: {
    body: {
      email: string;
      password: string;
      username: string;
      displayName: string;
    };
  }) => {
    // Validator
    try {
      if (!validator.isEmail(email)) {
        return ReturnData({
          status: ResponseStatus["BAD REQUEST"],
          message: "Invalid email",
        });
      }
      if (!validator.isStrongPassword(password)) {
        return ReturnData({
          status: ResponseStatus["BAD REQUEST"],
          message: "Password is not strong enough.",
        });
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
        return ReturnData({
          status: ResponseStatus["BAD REQUEST"],
          message: "Someone with this username already exists.",
        });
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
        return ReturnData({
          status: ResponseStatus["BAD REQUEST"],
          message: "Someone with this email already exists.",
        });
      }

      // handle success
      const encryptPassword = await argon2.hash(password);
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
        message:
          "Created account successfully, please check your email to get verification code",
        data,
      });
    } catch (error) {
      console.error(error);
      return ReturnData({
        status: ResponseStatus["INTERNAL SERVER ERROR"],
        message: "Internal Server Error",
        data: error,
      });
    }
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
