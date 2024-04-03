import Elysia from "elysia";
import { recentlycreated } from "./recentlycreated";
import { recentlyupdated } from "./recentlyupdated";
import { likemost } from "./likemost";
import { followmost } from "./followmost";
import { viewmost } from "./viewmost";
import { searchmost } from "./searchmost";
import { detail } from "./detail";
import { explore } from "./explore";
import { search } from "./search";

export const fetch = new Elysia({
  prefix: "/fetch",
})
  .use(recentlycreated)
  .use(recentlyupdated)
  .use(likemost)
  .use(followmost)
  .use(viewmost)
  .use(searchmost)
  .use(detail)
  .use(explore)
  .use(search)