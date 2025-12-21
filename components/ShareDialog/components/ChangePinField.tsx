import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Controller, useWatch } from "react-hook-form";

export const ChangePinField = ({ isEditMode }: { isEditMode: boolean }) => {
  const accessType = useWatch({ name: "accessType" });

  // 只在编辑模式 + password 类型时显示
  if (!isEditMode || accessType !== "password") return null;

  return (
    <Controller
      name="changePin"
      render={({ field }) => (
        <Field>
          <div className="flex items-center gap-2">
            <Switch
              id="change-pin"
              name="change-pin"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
            <FieldLabel htmlFor="change-pin">PINを変更する</FieldLabel>
          </div>
        </Field>
      )}
    />
  );
};
