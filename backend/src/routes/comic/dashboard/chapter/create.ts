import cuid from "cuid";
import Elysia, { t } from "elysia";
import IsValidToken from "../../../../util/check/checkToken";
import ReturnData from "../../../../util/format/return";
import { ResponseStatus } from "../../../../typings/endpoints";
import prisma from "../../../../db";
import { uploadChapter } from "../../../../controllers/media";

export const create = new Elysia().post(
  "/create",
  async ({
    body: { id, images, number, title, description },
    cookie: { accessToken },
  }) => {
    if (!IsValidToken(accessToken.value)) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid access token",
      });
    }

    const user = await prisma.accessToken.findUnique({
      where: {
        token: accessToken.value,
      },
      select: {
        author: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid user",
      });
    }

    const comic = await prisma.comic.findUnique({
      where: {
        id,
        authorId: user.author.id,
      },
      select: {
        chapters: true,
        id: true,
      },
    });

    if (!comic) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: `Comic is not exist`,
      });
    }

    const existChapter = await prisma.comic.findUnique({
      where: {
        id,
        chapters: {
          some: {
            number,
          },
        },
      },
    });

    if (existChapter) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: `Chapter number is exist`,
      });
    }

    const chapterId = cuid();

    const pathImages = await Promise.all(
      images.map(async (data) => {
        return await uploadChapter({
          data,
          chapterId,
          comicId: comic.id,
        });
      })
    );

    const chapter = await prisma.chapter.create({
      data: {
        id: chapterId,
        number,
        title,
        description,
        images: pathImages,
        comic: {
          connect: {
            id: comic.id,
          },
        },
      },
    });

    return ReturnData({
      status: ResponseStatus["CREATED"],
      message: `Create chapter successfully`,
      data: chapter,
    });
  },
  {
    body: t.Object({
      id: t.String(),
      number: t.Numeric(),
      title: t.String(),
      description: t.Optional(t.String()),
      images: t.Files({
        maxSize: 1024 * 1024 * 10, // 10MB
      }),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
    type: "multipart/form-data",
  }
);
