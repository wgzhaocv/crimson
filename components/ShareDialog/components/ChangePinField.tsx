import { Field, FieldLabel } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { Controller, useWatch } from "react-hook-form";

type ChangePinFieldProps = {
  isEditMode: boolean;
  initialAccessType?: "public" | "password" | "private";
};

export const ChangePinField = ({
  isEditMode,
  initialAccessType,
}: ChangePinFieldProps) => {
  const accessType = useWatch({ name: "accessType" });

  // 只在编辑模式 + 原本就是 password 类型 + 当前也是 password 时显示
  // 如果从非 password 改成 password，直接填 pin 即可，不需要显示开关
  if (
    !isEditMode ||
    initialAccessType !== "password" ||
    accessType !== "password"
  )
    return null;

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
