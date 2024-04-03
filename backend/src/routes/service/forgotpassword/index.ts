import Elysia from "elysia";
import { sendcode } from "./sendcode";
import { verify } from "./verify";
import { changepassword } from "./changepassword";

export const forgotpassword = new Elysia({
  prefix: "/forgotpassword",
})
  .use(sendcode)
  .use(verify)
  .use(changepassword);
