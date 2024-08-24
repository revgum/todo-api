import { cors } from "@momiji/cors";
import { Application, Router } from "@oak/oak";
import { API_PORT, CORS_OPTIONS, SIGNING_KEY } from "./constants.ts";
import { setResponseHeaders } from "./middleware.ts";
import { loginRouter, todosRouter } from "./routers.ts";

const routers = new Router()
  .use(
    loginRouter.routes(),
    loginRouter.allowedMethods(),
  ).use(
    todosRouter.routes(),
    todosRouter.allowedMethods(),
  );

const app = new Application({
  keys: [SIGNING_KEY],
});

app.use(cors(CORS_OPTIONS));
app.use(setResponseHeaders);

app.use(routers.routes());

app.addEventListener("listen", () => {
  console.log(`Listening on port ${API_PORT}`);
});

app.listen({ port: API_PORT });
