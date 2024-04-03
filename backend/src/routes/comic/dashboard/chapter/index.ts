import Elysia from "elysia";
import { create } from "./create";
import { images } from "./images";

export const chapter = new Elysia({ prefix: "/chapter" }).use(create).use(images);
