import Elysia from "elysia";
import { updateposition } from "./chapter/images/updateposition";
import { comic } from "./comic";
import { chapter } from "./chapter";

export const dashboard = new Elysia({
  prefix: "/dashboard",
})
  .use(comic)
  .use(chapter)
  .use(updateposition);
