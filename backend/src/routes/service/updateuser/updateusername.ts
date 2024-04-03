import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import IsValidToken from "../../../util/check/checkToken";
import prisma from "../../../db";

export const updateusername = new Elysia().patch(
  "/updateusername",
  async ({ body: { username }, cookie: { accessToken } }) => {
    if (!accessToken.value) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Token is required" });
    }

    const user = await prisma.accessToken.findUnique({
      where: {
        token: accessToken.value,
      },
      select: {
        author: true,
      },
    });

    if (!user) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "User not found" });
    }

    if (!IsValidToken(accessToken.value)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid token" });
    }

    if (user.author.username === username) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Duplicate usernames" });
    }

    const anotherUser = await prisma.author.findUnique({
      where: {
        username,
      },
      select: {
        username: true,
      },
    });

    if (anotherUser) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Username exist" });
    } else {
      const updateUsername = await prisma.author.update({
        where: {
          id: user.author.id,
        },
        data: {
          username,
        },
      });

      return ReturnData({
        status: ResponseStatus["OK"],
        message: "Update username successfully",
        data: updateUsername,
      });
    }
  },
  {
    body: t.Object({ username: t.String() }),
    cookie: t.Cookie({ accessToken: t.String() }),
  }
);
