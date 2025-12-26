import { cookies } from "next/headers";
import PinEntry from "./components/PinEntry";
import RateLimited from "./components/RateLimited";
import NotFound from "./not-found";

const ShareValidationPage = async () => {
  const shareState = (await cookies()).get("share-state")?.value;

  if (shareState?.startsWith("rate-limit:")) {
    const remainingSeconds = parseInt(shareState.split(":")[1], 10);
    return <RateLimited remainingSeconds={remainingSeconds} />;
  }

  if (shareState === "need-password") {
    return <PinEntry />;
  }

  if (shareState === "invalid-password") {
    return <PinEntry wrongPin={true} />;
  }

  if (shareState === "not-found") {
    return <NotFound />;
  }

  return <NotFound />;
};

export default ShareValidationPage;
