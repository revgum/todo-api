export const KV_PATH = Deno.env.has("DENO_DEPLOYMENT_ID")
  ? undefined
  : "./database";
export const TODO_KEY = "todos";
export const API_TOKEN = Deno.env.get("API_TOKEN");
export const API_PORT = 8000;
