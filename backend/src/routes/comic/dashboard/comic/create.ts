import { Genre, Status } from "@prisma/client";
import Elysia, { t } from "elysia";
import IsValidToken from "../../../../util/check/checkToken";
import ReturnData from "../../../../util/format/return";
import { ResponseStatus } from "../../../../typings/endpoints";
import prisma from "../../../../db";

export const create = new Elysia().post(
  "/create",
  async ({
    body: {
      name,
      alias,
      description,
      genre,
      thumbnail,
      color,
      status,
      copyright,
    },
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
            roles: true,
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
        name,
      },
      select: {
        name: true,
      },
    });

    if (comic) {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: `Comic ${comic.name} is already exist`,
      });
    }

    const data = await prisma.comic.create({
      data: {
        name,
        alias,
        description,
        genre,
        thumbnail,
        color,
        status,
        copyright,
        author: {
          connect: {
            id: user.author.id,
          },
        },
      },
    });

    return ReturnData({
      status: ResponseStatus["CREATED"],
      message: "Create comic successfully",
      data,
    });
  },
  {
    body: t.Object({
      name: t.String({
        minLength: 4,
      }),
      alias: t.Optional(
        t.String({
          minLength: 4,
        })
      ),
      description: t.String({
        minLength: 100,
      }),
      thumbnail: t.String({
        minLength: 4,
      }),
      genre: t.Array(t.Enum(Genre)),
      color: t.Boolean({
        default: false,
      }),
      status: t.Enum(Status, {
        default: Status.Coming_Soon,
      }),
      copyright: t.String({
        minLength: 4,
      }),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
  }
);
