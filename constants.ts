import { type CorsOptions } from "@momiji/cors";

export const IS_DEPLOYED = Deno.env.has("DENO_DEPLOYMENT_ID");

export const API_PORT = 8000;
export const API_TOKEN = Deno.env.get("API_TOKEN");
export const COOKIE_SIGNING_KEY = Deno.env.get("COOKIE_SIGNING_KEY") ||
  "signing-key-not-set";
export const COOKIE_SAME_SITE = Deno.env.get("COOKIE_SAME_SITE") ||
  "none";
export const KV_PATH = IS_DEPLOYED ? undefined : "./db/database";

export const TODO_KEY = "todos";

export const CORS_OPTIONS: CorsOptions = {
  origin: Deno.env.get("CORS_ORIGIN") || "*",
  credentials: true,
  maxAge: 86400,
};
