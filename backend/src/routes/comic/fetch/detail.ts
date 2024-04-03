import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";

export const detail = new Elysia().get(
  "/detail",
  async ({ query: { id } }) => {
    const data = await prisma.comic.findUnique({
      where: {
        id,
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
        status: true,
        id: true,
        updateAt: true,
        views: true,
        thumbnail: true,
        genre: true,
        verify: true,
      },
    });

    if (!data) {
      ReturnData({ status: ResponseStatus["NOT FOUND"], message: "Comic not found" });
    }

    await prisma.comic.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    return ReturnData({ status: ResponseStatus["OK"], message: `Fetch comic ${data?.name} successfully`, data });
  },
  { query: t.Object({ id: t.String() }) }
);
