import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import setExpires from "../../../util/set/setExpires";
import isExpires from "../../../util/check/checkExpires";
import getJWT from "../../../util/gen/genJwt";

export const verify = new Elysia().post(
  "/verify",
  async ({ body: { code, email }, cookie: { accessToken } }) => {
    // validator
    const user = await prisma.author.findUnique({
      where: {
        email,
      },
      include: {
        verification: {
          select: {
            code: true,
            expiredAt: true,
            id: true,
          },
        },
      },
    });

    if (!user) {
      return ReturnData({
        status: ResponseStatus["NOT FOUND"],
        message: "Account not found",
      });
    }

    // handle success and fail
    if (user.verification?.code === code) {
      if (isExpires(user.verification.expiredAt)) {
        return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Code was expired" });
      }

      const token = getJWT({ email, password: user.password });

      accessToken.value = token;

      const updateUser = await prisma.author.update({
        where: {
          id: user.id,
        },
        data: {
          verify: true,
          accessToken: {
            create: {
              token,
              expiredAt: setExpires("7d"),
            },
          },
          verification: {
            delete: {
              id: user.verification.id,
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

      return ReturnData({
        status: ResponseStatus["OK"],
        message: "Verify user successfully",
        data: updateUser,
      });
    } else {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Wrong code" });
    }
  },
  {
    body: t.Object({
      code: t.String(),
      email: t.String(),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
  }
)