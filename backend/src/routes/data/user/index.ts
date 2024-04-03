import Elysia from "elysia";
import { username } from "./username";
import { id } from "./id";

export const user = new Elysia({
  prefix: "/user",
})
  .use(username)
  .use(id);
