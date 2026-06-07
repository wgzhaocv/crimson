import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  // amber 服务端按 email 预建的用户（emailVerified=true）日后用 Google 登录时，
  // 按 email link 到同一行而非报「account already exists」。
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
    },
  },
});
