import PinCodeInput from "@/components/PinCodeInput";
import { Field } from "@/components/ui/field";
import { Controller, useWatch } from "react-hook-form";

export const PincodeField = () => {
  const accessType = useWatch({ name: "accessType" });
  const changePin = useWatch({ name: "changePin" });
  const needPin = accessType === "password" && changePin;

  if (!needPin) return null;

  return (
    <Controller
      name="pin"
      render={({ field }) => (
        <Field>
          <PinCodeInput value={field.value} onChange={field.onChange} />
        </Field>
      )}
    />
  );
};
