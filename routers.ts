import { Status } from "jsr:@oak/commons@0.11/status";
import { Router } from "@oak/oak/router";
import { API_TOKEN, KV_PATH } from "./constants.ts";
import { create, deleteById, getAll, getById, update } from "./todos.ts";

const kv = await Deno.openKv(KV_PATH);

/**
 * Single route for /login not requiring a valid cookie.
 */
export const loginRouter = new Router({ prefix: "/login" })
  .post("/", async (ctx) => {
    const payload = await ctx.request.body.json();
    if (payload.password === API_TOKEN) {
      await ctx.cookies.set("login", payload.password, {
        signed: true,
        maxAge: 60 * 60 * 24,
      });
      ctx.response.status = Status.OK;
    } else {
      ctx.response.status = Status.BadRequest;
    }
  });

/**
 * CRUD routes for /todos requiring a valid login cookie.
 */
export const todosRouter = new Router({ prefix: "/todos" }).use(
  async (ctx, next) => {
    const isLoggedIn = await ctx.cookies.has("login");
    if (isLoggedIn) {
      await next();
    } else {
      ctx.response.status = Status.Unauthorized;
    }
  },
)
  .get("/", async (ctx) => {
    const todos = await getAll(kv);
    ctx.response.body = JSON.stringify({ todos });
  })
  .get("/:id", async (ctx) => {
    const value = await getById(kv, ctx.params.id);
    if (value) {
      ctx.response.body = JSON.stringify(value);
    } else {
      ctx.response.status = Status.NotFound;
    }
  })
  .post("/", async (ctx) => {
    const obj = await ctx.request.body.json();
    const value = await create(kv, obj);
    if (value) {
      ctx.response.body = JSON.stringify(value);
    } else {
      ctx.response.status = Status.BadRequest;
    }
  })
  .patch("/:id", async (ctx) => {
    const obj = await ctx.request.body.json();
    const value = await update(kv, ctx.params.id, obj);
    if (value) {
      ctx.response.body = JSON.stringify(value);
    } else {
      ctx.response.status = Status.BadRequest;
    }
  })
  .delete("/:id", async (ctx) => {
    await deleteById(kv, ctx.params.id);
    ctx.response.body = JSON.stringify({ status: `Deleted ${ctx.params.id}` });
  });
