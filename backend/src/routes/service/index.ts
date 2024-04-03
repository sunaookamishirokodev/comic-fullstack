import Elysia from "elysia";
import { forgotpassword } from "./forgotpassword";
import { updateuser } from "./updateuser";

export const service = new Elysia({
  prefix: "/service",
})
  .use(forgotpassword)
  .use(updateuser);
