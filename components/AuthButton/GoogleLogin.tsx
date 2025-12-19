"use client";

import { GoogleIcon } from "@/components/Icons/GoogleIcon";
import { Button } from "../ui/button";
import { useTransition } from "react";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";
import { getErrorMessage } from "@/lib/auth-error-messages";

export const GoogleLogin = ({
  setError,
}: {
  setError: (error: string) => void;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onError(ctx) {
          setError(getErrorMessage(ctx.error.code));
        },
      }
    );
  };

  return (
    <Button
      variant="outline"
      className="w-full h-12 text-xs font-bold border-border/60 bg-transparent hover:bg-accent transition-all duration-300"
      onClick={() => startTransition(handleGoogleSignIn)}
      disabled={isPending}
    >
      <div className="mr-3">
        <GoogleIcon />
      </div>
      {isPending ? <Spinner /> : "Googleでサインイン"}
    </Button>
  );
};
