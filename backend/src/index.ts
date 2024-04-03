import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";
import { auth } from "./routes/auth";
import { staticPlugin } from "@elysiajs/static";
import ReturnData from "./util/format/return";
import { ResponseStatus } from "./typings/endpoints";
import IHandler from "./typings/handler";
import setExpires from "./util/set/setExpires";
import ms from "ms";
import { service } from "./routes/service";
import { comic } from "./routes/comic";
import { data } from "./routes/data";

const app = new Elysia({
  cookie: {
    expires: setExpires("7d"),
    httpOnly: true,
    maxAge: ms("7d"),
    path: "/",
    priority: "medium",
    sameSite: "strict",
  },
})
  // Version
  .state(
    "version",
    JSON.stringify(
      ReturnData({
        status: ResponseStatus["OK"],
        message: "Get Version API",
        data: 1.3,
      })
    )
  )
  .get("/version", ({ store: { version } }) => `Version: ${version}`)
  .use(swagger())
  .use(staticPlugin())
  .use(
    cors({
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: [
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
        "Authorization",
      ],
      origin: ["https://shirokodev.site", "http://localhost:3000"],
    })
  )
  // Router
  .use(service)
  .use(comic)
  .use(auth)
  .use(data)
  // Handler
  .onError(({ code, error }) => {
    if (code === "NOT_FOUND")
      return ReturnData({
        status: ResponseStatus["NOT FOUND"],
        message: "Router Not Found",
      });
  })
  .onRequest(({ request, set }) => {})
  // Init method
  .get("/", ({ request, set }: IHandler) => {
    return "Hello! This API is owned by Shiroko, any problems about the API please contact me via my lethanhtrung.trungle@gmail.com";
  })
  // Listen
  .listen(process.env.PORT || 5555);
console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);
