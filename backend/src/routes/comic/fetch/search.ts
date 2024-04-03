import Elysia, { t } from "elysia";
import ReturnData from "../../../util/format/return";
import { ResponseStatus, SearchResult } from "../../../typings/endpoints";
import SearchEngine from "../../../system/search";

export const search = new Elysia().post(
  "/search",
  async ({ body: { searchString } }) => {
    const result: Array<SearchResult | null> = await SearchEngine(searchString);
    if (result.length === 0) {
      return ReturnData({ status: ResponseStatus["BAD REQUEST"], message: "Cant find any result" });
    } else {
      return ReturnData({ status: ResponseStatus["OK"], message: `Found ${result.length} result`, data: result });
    }
  },
  {
    body: t.Object({
      searchString: t.String(),
    }),
  }
);
