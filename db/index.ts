import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import type { D1Database } from "@cloudflare/workers-types";

declare const env: {
  DB: D1Database;
};

export function getDb() {
  return drizzle(env.DB, { schema });
}
