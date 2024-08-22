import { Context, Next, Status } from "@oak/oak";
import { API_TOKEN } from "./constants.ts";

export const authorize = async (ctx: Context, next: Next) => {
  const authHeader = ctx.request.headers.get("Authorization");

  if (!authHeader) {
    ctx.response.status = Status.BadRequest;
  } else {
    const [_, token] = authHeader.split(" ");
    if (token !== API_TOKEN) {
      ctx.response.status = Status.Forbidden;
    } else {
      await next();
    }
  }
};

export const setResponseHeaders = async (ctx: Context, next: Next) => {
  await next();
  ctx.response.headers.append(
    "Content-Type",
    "application/json; charset=UTF-8",
  );
};
