import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { schema } from "@/db/schema";

const client = postgres(process.env.DATABASE_URL!, {
  ssl: false,
});

export const db = drizzle(client, { schema });
