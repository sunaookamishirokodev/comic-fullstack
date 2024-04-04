import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";

export const logout = new Elysia().post(
  "/logout",
  async ({
    body: { email },
    cookie: { accessToken },
  }: {
    body: { email: string };
    cookie: { accessToken: any };
  }) => {
    const data = await prisma.author.findUnique({
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

    if (!data) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: "Invalid email",
      });
    }

    if (!data.accessToken.some((o: any) => o.token === accessToken.value)) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: "Must have access token",
      });
    }

    await prisma.accessToken.delete({
      where: {
        token: accessToken.value,
      },
    });

    accessToken.remove();
    return ReturnData({
      status: ResponseStatus["OK"],
      message: "Logout account successfully",
    });
  },
  {
    body: t.Object({
      email: t.String(),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
  }
);
