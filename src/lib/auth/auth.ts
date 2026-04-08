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
    secret: env.BETTER_AUTH_SECRET,
    baseURL: process.env.NODE_ENV === "development" ? undefined : env.BETTER_AUTH_URL,
    socialProviders: {
        ...(env.AUTH_GOOGLE_ID && env.AUTH_GOOGLE_SECRET ? {
            google: {
                clientId: env.AUTH_GOOGLE_ID,
                clientSecret: env.AUTH_GOOGLE_SECRET,
            },
        } : {}),
    },
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        trustedProxyHeaders: true
    },
    plugins: [
        nextCookies()
    ],
    logger: {
        level: "debug",
    }
});

