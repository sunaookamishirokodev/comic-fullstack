import Elysia, { t } from "elysia";
import IsValidToken from "../../../../../util/check/checkToken";
import ReturnData from "../../../../../util/format/return";
import { ResponseStatus } from "../../../../../typings/endpoints";
import prisma from "../../../../../db";
import _ from "lodash";

export const updateposition = new Elysia().patch(
  "/updateposition",
  async ({
    body: { chapterId, position, destination },
    cookie: { accessToken },
  }) => {
    if (!IsValidToken(accessToken.value)) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid access token",
      });
    }

    const user = await prisma.accessToken.findUnique({
      where: { token: accessToken.value },
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

    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        comic: {
          authorId: user.author.id,
        },
      },
      select: {
        images: true,
        id: true,
      },
    });

    if (!chapter) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: `Chapter is not exist`,
      });
    }

    if (destination > chapter.images.length) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: `Destination is higher than images length`,
      });
    }

    chapter.images.splice(
      destination,
      0,
      chapter.images.splice(position, 1)[0]
    );

    const changeDestination = await prisma.chapter.update({
      where: {
        id: chapter.id,
      },
      data: {
        images: {
          set: chapter.images,
        },
      },
    });

    return ReturnData({
      status: ResponseStatus["OK"],
      message: `Update destination successfully`,
      data: changeDestination,
    });
  },
  {
    body: t.Object({
      chapterId: t.String(),
      position: t.Numeric({
        minimum: 0,
      }),
      destination: t.Numeric(),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
  }
);
