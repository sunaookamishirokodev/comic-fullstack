import Elysia from "elysia";
import { user } from "./user";

export const data = new Elysia({
  prefix: "/data",
}).use(user);
