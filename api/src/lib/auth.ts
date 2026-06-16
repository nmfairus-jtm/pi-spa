import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db  from "../db/index.js";
import * as schema from "../db/schema.js";
import { admin } from "better-auth/plugins/admin";
import { organization } from "better-auth/plugins/organization";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema,
    }),
    emailAndPassword: { 
    enabled: true, 
  },
  trustedOrigins: ["http://localhost:5173"],
  advanced: {
    crossSubDomainCookies: {
      enabled: true
    }
  },
  plugins: [
        admin(), organization()
    ]
});