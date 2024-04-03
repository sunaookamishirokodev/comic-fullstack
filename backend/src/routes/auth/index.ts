import { Elysia } from "elysia";
import { account } from "./account";

export const auth = new Elysia({
  prefix: "/auth",
}).use(account);
