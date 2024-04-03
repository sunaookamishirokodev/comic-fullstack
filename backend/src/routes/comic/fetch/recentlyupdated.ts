import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";

export const recentlyupdated = new Elysia().get(
  "/recentlyupdated",
  async ({ query: { count } }) => {
    const data = await prisma.comic.findMany({
      where: {
        NOT: {
          genre: {
            has: "Ecchi",
          },
        },
        verify: true,
      },
      select: {
        name: true,
        alias: true,
        description: true,
        authorId: true,
        color: true,
        createAt: true,
        copyright: true,
        dislikes: true,
        follows: true,
        likes: true,
        search: true,
        status: true,
        id: true,
        updateAt: true,
        views: true,
        thumbnail: true,
        genre: true,
        verify: true,
      },
      orderBy: {
        updateAt: "desc",
      },
      take: count,
    });

    return ReturnData({ status: ResponseStatus["OK"], message: `Fetch ${data.length} comic successfully`, data });
  },
  {
    query: t.Object({
      count: t.Numeric({
        default: 10,
      }),
    }),
  }
);
