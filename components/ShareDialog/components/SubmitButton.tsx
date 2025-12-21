import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

export const SubmitButton = () => {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button
      type="submit"
      size="sm"
      disabled={isSubmitting}
      className="h-9 px-6 font-bold"
    >
      {isSubmitting ? <Spinner /> : "保存"}
    </Button>
  );
};
