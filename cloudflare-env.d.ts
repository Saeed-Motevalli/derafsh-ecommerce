import type { D1Database } from "@cloudflare/workers-types";

declare module "cloudflare:workers" {
  export const env: {
    ASSETS: Fetcher;
    DB: D1Database;
    IMAGES: unknown;
  };
}

export {};
