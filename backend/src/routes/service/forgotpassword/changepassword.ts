import Elysia, { t } from "elysia";
import prisma from "../../../db";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import validator from "validator";
import bcrypt from "bcrypt";
import IsValidToken from "../../../util/check/checkToken";

export const changepassword = new Elysia().post(
  "/changepassword",
  async ({ body: { email, newPassword }, cookie: { temporaryToken } }) => {
    if (!validator.isEmail(email)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid email" });
    }
    if (!validator.isStrongPassword(newPassword)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid password" });
    }

    const user = await prisma.author.findUnique({
      where: {
        email,
      },
      include: {
        temporaryToken: {
          select: {
            token: true,
          },
        },
      },
    });

    if (!user) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "User not found" });
    }

    if (user.temporaryToken?.token !== temporaryToken.value || !IsValidToken(temporaryToken.value)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid Token" });
    }

    const encryptPassword = await bcrypt.hash(newPassword, 10);

    const updateUser = await prisma.author.update({
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

    await prisma.temporaryToken.delete({
      where: {
        token: temporaryToken.value,
        authorId: user.id,
      },
    });

    return ReturnData({
      status: ResponseStatus["OK"],
      message: "Change password successfully",
      data: updateUser,
    });
  },
  {
    body: t.Object({
      email: t.String(),
      newPassword: t.String(),
    }),
    cookie: t.Cookie({
      temporaryToken: t.String(),
    }),
  }
);
