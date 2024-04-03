import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import IsValidToken from "../../../util/check/checkToken";
import prisma from "../../../db";

export const updatedisplayname = new Elysia().patch(
  "/updatedisplayname",
  async ({ body: { displayName }, cookie: { accessToken } }) => {
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

    const updateDisplayName = await prisma.author.update({
      where: {
        id: user.author.id,
      },
      data: {
        displayName,
      },
    });

    return ReturnData({
      status: ResponseStatus["OK"],
      message: "Update display name successfully",
      data: updateDisplayName,
    });
  },
  {
    body: t.Object({ displayName: t.String() }),
    cookie: t.Cookie({ accessToken: t.String() }),
  }
);
