import { type CorsOptions } from "@momiji/cors";

export const IS_DEPLOYED = Deno.env.has("DENO_DEPLOYMENT_ID");

export const KV_PATH = IS_DEPLOYED ? undefined : "./database";
export const TODO_KEY = "todos";
export const API_TOKEN = Deno.env.get("API_TOKEN");
export const API_PORT = 8000;

export const CORS_OPTIONS: CorsOptions = {
  origin: IS_DEPLOYED ? Deno.env.get("CORS_ORIGIN") : "*",
  credentials: true,
  maxAge: 86400,
};
