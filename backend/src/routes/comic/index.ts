import Elysia from "elysia";
import { dashboard } from "./dashboard";
import { fetch } from "./fetch";

export const comic = new Elysia({
  prefix: "/comic",
})
  .use(dashboard)
  .use(fetch);
