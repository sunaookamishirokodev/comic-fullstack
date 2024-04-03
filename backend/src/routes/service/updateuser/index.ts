import Elysia from "elysia";
import { updateavatar } from "./updateavatar";
import { updatebanner } from "./updatebanner";
import { updateusername } from "./updateusername";
import { updatedisplayname } from "./updatedisplayname";

export const updateuser = new Elysia({
  prefix: "/updateuser",
})
  .use(updateavatar)
  .use(updatebanner)
  .use(updateusername)
  .use(updatedisplayname);
