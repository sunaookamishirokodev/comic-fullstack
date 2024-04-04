import Elysia, { t } from "elysia";
import validator from "validator";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import IsValidToken from "../../../util/check/checkToken";
import * as argon2 from "argon2";

export const changepassword = new Elysia().patch(
  "/changepassword",
  async ({
    body: { email, oldPassword, newPassword },
    cookie: { accessToken },
  }) => {
    if (!validator.isEmail(email)) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid email",
      });
    }
    if (
      !validator.isStrongPassword(oldPassword) ||
      !validator.isStrongPassword(newPassword)
    ) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid password",
      });
    }

    if (newPassword === oldPassword) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: "The new password matches the old password",
      });
    }

    const user = await prisma.author.findUnique({
      where: {
        email,
      },
      include: {
        accessToken: {
          select: {
            token: true,
          },
        },
      },
    });

    if (!user) {
      return ReturnData({
        status: ResponseStatus["NOT FOUND"],
        message: "User not found",
      });
    }

    if (
      !user.accessToken.find((o: any) => o.token === accessToken.value) ||
      !IsValidToken(accessToken.value)
    ) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid Token",
      });
    }

    const isCorrectPassword = await argon2.verify(oldPassword, user.password);

    if (isCorrectPassword) {
      const encryptPassword = await argon2.hash(newPassword);

      const updatePassword = await prisma.author.update({
        where: {
          email,
        },
        data: {
          password: encryptPassword,
        },
        select: {
          id: true,
          avatar: true,
          email: true,
          createAt: true,
          premium: true,
          displayName: true,
        },
      });

      return ReturnData({
        status: ResponseStatus["OK"],
        message: "Change password successfully",
        data: updatePassword,
      });
    } else {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Wrong password",
      });
    }
  },
  {
    body: t.Object({
      email: t.String(),
      oldPassword: t.String(),
      newPassword: t.String(),
    }),
  }
);
