import Elysia, { t } from "elysia";
import validator from "validator";
import setExpires from "../../../util/set/setExpires";
import getJWT from "../../../util/gen/genJwt";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";

export const verify = new Elysia().post(
  "/verify",
  async ({ body: { email, code }, cookie: { temporaryToken } }) => {
    if (!validator.isEmail(email)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid email" });
    }

    const user = await prisma.author.findUnique({
      where: {
        email,
      },
      select: {
        changePassword: {
          select: {
            code: true,
          },
        },
        id: true,
        email: true,
        password: true,
      },
    });

    if (user?.changePassword?.code === code) {
      await prisma.changePassword.delete({
        where: {
          authorId: user.id,
        },
      });

      const newToken = getJWT({ email, password: user.password });

      const data = await prisma.author.update({
        where: {
          id: user.id,
        },
        data: {
          temporaryToken: {
            create: {
              token: newToken,
              expiredAt: setExpires("5m"),
            },
          },
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

      temporaryToken.value = newToken;

      return ReturnData({
        status: ResponseStatus["OK"],
        message: "Verified Successfully",
        data,
      });
    } else {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Invalid code" });
    }
  },
  {
    body: t.Object({
      email: t.String(),
      code: t.String(),
    }),
    cookie: t.Cookie({
      temporaryToken: t.String(),
    }),
  }
)