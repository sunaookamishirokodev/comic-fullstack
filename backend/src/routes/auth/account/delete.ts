const bcrypt = require("bcrypt");
import Elysia, { t } from "elysia";
import validator from "validator";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import IsValidToken from "../../../util/check/checkToken";

export const _delete = new Elysia().delete(
  "/delete",
  async ({ body: { email, password, id }, cookie: { accessToken } }) => {
    if (!validator.isEmail(email)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid email" });
    }
    if (!validator.isStrongPassword(password)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid password" });
    }
    if (!IsValidToken(accessToken.value)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid access token" });
    }

    const data = await prisma.author.findUnique({
      where: {
        email,
        accessToken: {
          some: {
            token: accessToken.value,
          },
        },
      },
      select: {
        email: true,
        password: true,
        id: true,
      },
    });

    if (!data) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "Invalid email or access token" });
    }

    const isCorrectPassword = await bcrypt.compare(password, data.password);

    if (isCorrectPassword) {
      accessToken.remove();

      await prisma.author.delete({
        where: {
          email,
          id,
        },
      });

      return ReturnData({ status: ResponseStatus["OK"], message: "Delete account successfully" });
    } else {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Wrong password" });
    }
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
      id: t.String(),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
  }
)