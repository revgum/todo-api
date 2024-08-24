import { Context, Next } from "@oak/oak";

export const setResponseHeaders = async (ctx: Context, next: Next) => {
  await next();
  ctx.response.headers.append(
    "Content-Type",
    "application/json; charset=UTF-8",
  );
};
