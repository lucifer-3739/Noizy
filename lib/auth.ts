import { db } from "@/db/drizzle";
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { schema } from "@/db/schema";

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  // ✅ Correct adapter usage
  database: drizzleAdapter(db, {
    provider: "sqlite", // or "pg" or "mysql"
    schema: {
      ...schema,
      user: schema.users,
    },
  }),

  // ✅ Plugin for Next.js cookies
  plugins: [nextCookies()],
});
