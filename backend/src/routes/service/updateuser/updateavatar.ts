import Elysia, { t } from "elysia";
import { uploadAvatarUser } from "../../../controllers/media";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import IsValidToken from "../../../util/check/checkToken";
import fs from "fs/promises";

export const updateavatar = new Elysia().patch(
  "/updateavatar",
  async ({ body: { avatar }, cookie: { accessToken } }) => {
    if (!accessToken.value) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Token is required",
      });
    }

    if (avatar.type.split("/")[0] !== "image") {
      return ReturnData({
        status: ResponseStatus["BAD REQUEST"],
        message: "The image format is incorrect",
      });
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
      return ReturnData({
        status: ResponseStatus["NOT FOUND"],
        message: "User not found",
      });
    }

    if (!IsValidToken(accessToken.value)) {
      return ReturnData({
        status: ResponseStatus["UNAUTHORIZED"],
        message: "Invalid token",
      });
    }

    const imageName = await uploadAvatarUser(avatar);

    if (user.author.avatar) {
      await fs.rm(`./public/${user.author.avatar}`);
    }

    const updateAvatar = await prisma.author.update({
      where: {
        id: user.author.id,
      },
      data: {
        avatar: imageName,
      },
      select: {
        id: true,
        email: true,
        createAt: true,
        avatar: true,
        displayName: true,
        premium: true,
      },
    });

    return ReturnData({
      status: ResponseStatus["OK"],
      message: "Update avatar successfully",
      data: updateAvatar,
    });
  },
  {
    body: t.Object({
      avatar: t.File({
        maxSize: 1024 * 1024 * 10, // 10MB
      }),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
    type: "multipart/form-data",
  }
);
