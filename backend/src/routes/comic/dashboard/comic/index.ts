import Elysia from "elysia";
import { create } from "./create";

export const comic = new Elysia({ prefix: "/comic" }).use(create);
