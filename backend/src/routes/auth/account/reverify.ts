import Elysia, { t } from "elysia";
import validator from "validator";
import ReturnData from "../../../util/format/return";
import { ResponseStatus } from "../../../typings/endpoints";
import prisma from "../../../db";
import SendVerificationCode from "../../../services/email/verificationCode";
import genCode from "../../../util/gen/genCode";
import setExpires from "../../../util/set/setExpires";

export const reverify = new Elysia().post(
  "reverify",
  async ({ body: { email, id } }) => {
    if (!validator.isEmail(email)) {
      return ReturnData({ status: ResponseStatus["UNAUTHORIZED"], message: "Invalid email" });
    }
    const data = await prisma.author.findUnique({
      where: {
        email,
        id,
      },
      select: {
        email: true,
        id: true,
        verify: true,
      },
    });

    if (!data) {
      return ReturnData({ status: ResponseStatus["NOT FOUND"], message: "Email not found" });
    }

    if (data.verify) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Account is verified" });
    }

    const code = genCode();

    SendVerificationCode({ email, code });

    await await prisma.verification.update({
      where: {
        authorId: data.id,
      },
      data: {
        code,
        expiredAt: setExpires("5m"),
      },
      select: {
        id: true,
      },
    });

    return ReturnData({
      status: ResponseStatus["OK"],
      message: "Sent email successfully, please check your email to get verification code",
      data: {
        id: data.id,
        email: data.email,
      },
    });
  },
  {
    body: t.Object({
      email: t.String(),
      id: t.String(),
    }),
  }
);
