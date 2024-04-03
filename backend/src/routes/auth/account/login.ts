const bcrypt = require("bcrypt");
import Elysia, { t } from "elysia";
import validator from "validator";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import setExpires from "../../../util/set/setExpires";
import getJWT from "../../../util/gen/genJwt";

export const login = new Elysia().post(
  "/login",
  async ({ body: { email, password }, cookie: { accessToken } }) => {
    // validator
    if (!validator.isEmail(email)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid email" });
    }
    if (!validator.isStrongPassword(password)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid password" });
    }

    const data = await prisma.author.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        verify: true,
        avatar: true,
        createAt: true,
        premium: true,
        displayName: true,
      },
    });

    if (!data) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "Email Not Found" });
    }

    if (!data.verify) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Account is not verified", data });
    }

    const isCorrectPassword = await bcrypt.compare(password, data.password);

    // handle success and fail
    if (isCorrectPassword) {
      const newToken = getJWT({ email, password: data.password });
      accessToken.value = newToken;

      await prisma.author.update({
        where: {
          id: data.id,
        },
        data: {
          loginCount: {
            increment: 1,
          },
          accessToken: {
            create: {
              token: accessToken.value,
              expiredAt: setExpires("7d"),
            },
          },
        },
      });

      return ReturnData({
        status: ResponseStatus["OK"],
        message: "Login account successfully",
        data: {
          id: data.id,
          email: data.email,
          createAt: data.createAt,
          avatar: data.avatar,
          displayName: data.displayName,
          premium: data.premium,
        },
      });
    } else {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Wrong password" });
    }
  },
  {
    body: t.Object({
      email: t.String(),
      password: t.String(),
    }),
  }
);
