import { createAuthClient } from "better-auth/client";
import { passkeyClient } from "@better-auth/passkey/client";

export const authClient = createAuthClient({
    plugins: [
        passkeyClient(),
    ]
});

export const signInWithGoogle = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
    });
};

export const signInWithPasskey = async () => {
  const data = await authClient.signIn.passkey();
};