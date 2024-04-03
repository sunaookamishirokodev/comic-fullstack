import Elysia, { t } from "elysia";
import prisma from "../../../db";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";

export const id = new Elysia().get(
  "/id",
  async ({ query: { id } }) => {
    const user = await prisma.author.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        avatar: true,
        banner: true,
        createAt: true,
        displayName: true,
        email: true,
        id: true,
        exp: true,
        level: true,
        premium: true,
        translatorTeam: true,
      },
    });

    if (!user) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "User not found" });
    }

    return ReturnData({ status: ResponseStatus["OK"], message: "Get account data successfully", data: user });
  },
  {
    query: t.Object({
      id: t.String(),
    }),
  }
);