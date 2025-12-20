import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Globe, KeyRound, Lock, type LucideIcon } from "lucide-react";
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { PinCodeInput } from "../PinCodeInput";

type AccessOptionProps = {
  value: string;
  label: string;
  icon: LucideIcon;
  isSelected: boolean;
};

const AccessOption = ({
  value,
  label,
  icon: Icon,
  isSelected,
}: AccessOptionProps) => {
  const id = `access-${value}`;

  return (
    <FieldLabel
      htmlFor={id}
      className={cn(
        "bg-background hover:bg-accent/50 flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-transparent p-4 transition-all",
        isSelected && "border-primary bg-primary/5 shadow-sm",
      )}
    >
      <div className="flex flex-col items-center justify-center">
        <RadioGroupItem value={value} id={id} className="sr-only h-0 w-0" />
        <Icon
          className={cn(
            "mb-2 h-6 w-6 transition-colors",
            isSelected ? "text-primary" : "text-muted-foreground",
          )}
        />
        <span
          className={cn(
            "text-xs",
            isSelected ? "text-primary" : "text-foreground",
          )}
        >
          {label}
        </span>
      </div>
    </FieldLabel>
  );
};

export const AccessTypeSection = () => {
  const [accessType, setAccessType] = useState("public");

  return (
    <>
      <Field>
        <FieldLabel className="mb-2 block">公開範囲の設定</FieldLabel>
        <RadioGroup
          defaultValue="public"
          onValueChange={(value) => setAccessType(value as string)}
          className="grid grid-cols-3 gap-3"
        >
          <AccessOption
            value="public"
            label="公開"
            icon={Globe}
            isSelected={accessType === "public"}
          />
          <AccessOption
            value="private"
            label="自分のみ"
            icon={Lock}
            isSelected={accessType === "private"}
          />
          <AccessOption
            value="pin"
            label="パスワード"
            icon={KeyRound}
            isSelected={accessType === "pin"}
          />
        </RadioGroup>
      </Field>

      {/* PIN入力セクション */}
      {accessType === "pin" && (
        <Field className="animate-in fade-in slide-in-from-top-3 duration-400">
          <PinCodeInput />
        </Field>
      )}
    </>
  );
};
