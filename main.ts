import { Application, Router, Status } from "@oak/oak";
import { API_PORT, KV_PATH } from "./constants.ts";
import { authorize, setResponseHeaders } from "./middleware.ts";
import { create, deleteById, getAll, getById, update } from "./todos.ts";

const kv = await Deno.openKv(KV_PATH);

const router = new Router();

router.get("/", async (ctx) => {
  const todos = await getAll(kv);
  ctx.response.body = JSON.stringify({ todos });
});

router.get("/:id", async (ctx) => {
  const value = await getById(kv, ctx.params.id);
  if (value) {
    ctx.response.body = JSON.stringify(value);
  } else {
    ctx.response.status = Status.NotFound;
  }
});

router.post("/", async (ctx) => {
  const obj = await ctx.request.body.json();
  const value = await create(kv, obj);
  if (value) {
    ctx.response.body = JSON.stringify(value);
  } else {
    ctx.response.status = Status.BadRequest;
  }
});

router.patch("/:id", async (ctx) => {
  const obj = await ctx.request.body.json();
  const value = await update(kv, ctx.params.id, obj);
  if (value) {
    ctx.response.body = JSON.stringify(value);
  } else {
    ctx.response.status = Status.BadRequest;
  }
});

router.delete("/:id", async (ctx) => {
  await deleteById(kv, ctx.params.id);
  ctx.response.body = JSON.stringify({ status: `Deleted ${ctx.params.id}` });
});

const app = new Application();
app.use(authorize);
app.use(setResponseHeaders);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", () => {
  console.log(`Listening on port ${API_PORT}`);
});

app.listen({ port: API_PORT });
