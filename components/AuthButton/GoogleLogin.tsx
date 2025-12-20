"use client";

import { GoogleIcon } from "@/components/Icons/GoogleIcon";
import { Button } from "../ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Spinner } from "../ui/spinner";
import { getErrorMessage } from "@/lib/auth-error-messages";

export const GoogleLogin = ({
  setError,
}: {
  setError: (error: string) => void;
}) => {
  const [isPending, setIsPending] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsPending(true);
    await authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onError(ctx) {
          setError(getErrorMessage(ctx.error.code));
          setIsPending(false);
        },
      },
    );
  };

  return (
    <Button
      variant="outline"
      className="border-border/60 hover:bg-accent h-12 w-full bg-transparent text-sm font-bold transition-all duration-300"
      onClick={handleGoogleSignIn}
      disabled={isPending}
    >
      <div className="mr-3">
        <GoogleIcon />
      </div>
      {isPending ? <Spinner /> : "Googleでサインイン"}
    </Button>
  );
};
