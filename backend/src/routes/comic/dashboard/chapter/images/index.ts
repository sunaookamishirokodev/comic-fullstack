import Elysia from "elysia";
import { updateposition } from "./updateposition";

export const images = new Elysia({ prefix: "/images" }).use(updateposition);
