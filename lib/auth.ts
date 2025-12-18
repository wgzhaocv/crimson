import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import { passkey } from "@better-auth/passkey"

// 从 BETTER_AUTH_URL 提取 rpID（hostname）
const getRelyingPartyID = () => {
    const url = process.env.BETTER_AUTH_URL as string;
    try {
        const hostname = new URL(url).hostname;
        return hostname;
    } catch {
        return "localhost"; // fallback
    }
};

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
    plugins: [
        passkey({
            rpID: getRelyingPartyID(), // 从环境变量动态提取
            rpName: "CRIMSON",
            origin: process.env.BETTER_AUTH_URL as string,
            authenticatorSelection: {
                authenticatorAttachment: "cross-platform", // 使用跨平台认证器（如手机）
                residentKey: "preferred", // 推荐但不强制存储凭证
                userVerification: "preferred", // 推荐但不强制生物识别
            },
        }),
    ],
});