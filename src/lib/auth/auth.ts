import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db/db";
import * as schema from "@/lib/db/schema";
import { nextCookies } from "better-auth/next-js";
import { env } from "@/lib/env";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: schema.user,
            session: schema.session,
            account: schema.account,
            verification: schema.verification,
        }
    }),
    socialProviders: {
        google: {
            clientId: env.AUTH_GOOGLE_ID || "",
            clientSecret: env.AUTH_GOOGLE_SECRET || "",
        },
    },
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        nextCookies()
    ]
});
