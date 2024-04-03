import { Elysia } from "elysia";
import { register } from "./register";
import { reverify } from "./reverify";
import { login } from "./login";
import { verify } from "./verify";
import { _delete } from "./delete";
import { changepassword } from "./changepassword";
import { logout } from "./logout";

export const account = new Elysia({
  prefix: "/account",
})
  .use(register)
  .use(reverify)
  .use(login)
  .use(logout)
  .use(verify)
  .use(_delete)
  .use(changepassword);
