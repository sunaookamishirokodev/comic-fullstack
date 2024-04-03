import Elysia, { t } from "elysia";
import sendChangePasswordCode from "../../../services/email/changePasswordCode";
import genCode from "../../../util/gen/genCode";
import prisma from "../../../db";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import setExpires from "../../../util/set/setExpires";

export const sendcode = new Elysia().post(
  "/sendcode",
  async ({ body: { email } }) => {
    const user = await prisma.author.findUnique({
      where: {
        email,
      },
      select: {
        email: true,
        username: true,
      },
    });

    if (!user) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "Email not found" });
    }

    const code = genCode();

    sendChangePasswordCode({ email, code, username: user.username });

    await prisma.author.update({
      where: {
        email,
      },
      data: {
        changePassword: {
          upsert: {
            create: {
              code,
              expiredAt: setExpires("1m"),
            },
            update: {
              code,
              expiredAt: setExpires("1m"),
            },
          },
        },
      },
    });

    return ReturnData({ status: ResponseStatus["OK"], message: "Sent reverification code successfully" });
  },
  {
    body: t.Object({
      email: t.String(),
    }),
  }
);
