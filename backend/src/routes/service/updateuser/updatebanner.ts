import Elysia, { t } from "elysia";
import { uploadBannerUser } from "../../../controllers/media";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import IsValidToken from "../../../util/check/checkToken";
import fs from "fs";
import { config } from "../../../config";

export const updatebanner = new Elysia().patch(
  "/updatebanner",
  async ({ body: { banner }, cookie: { accessToken } }) => {
    if (!accessToken.value) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Token is required" });
    }

    if (banner.type.split("/")[0] !== "image") {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "The image format is incorrect" });
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

    const imageName = await uploadBannerUser(banner);

    if (user.author.banner) {
      fs.unlinkSync(`./public/${user.author.banner}`);
    }

    const updateBanner = await prisma.author.update({
      where: {
        id: user.author.id,
      },
      data: {
        banner: imageName,
      },
      select: {
        id: true,
        email: true,
        createAt: true,
        banner: true,
        displayName: true,
        premium: true,
      },
    });

    return ReturnData({ status: ResponseStatus["OK"], message: "Update banner successfully", data: updateBanner });
  },
  {
    body: t.Object({
      banner: t.File({
        maxSize: 1024 * 1024 * 10, // 10MB
      }),
    }),
    cookie: t.Cookie({
      accessToken: t.String(),
    }),
    type: "multipart/form-data",
  }
);
