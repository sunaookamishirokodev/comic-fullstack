import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";

export const explore = new Elysia().get(
  "/explore",
  async ({ query: { count, page } }) => {
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
      skip: count * (page - 1),
    });

    return ReturnData({ status: ResponseStatus["OK"], message: `Fetch ${data.length} successfully`, data });
  },
  {
    query: t.Object({
      count: t.Numeric({
        default: 50,
      }),
      page: t.Numeric({
        default: 1,
      }),
    }),
  }
)