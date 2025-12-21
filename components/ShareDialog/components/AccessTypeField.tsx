import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import { Globe, KeyRound, LockIcon, LucideIcon } from "lucide-react";
import { Controller } from "react-hook-form";

type AccessType = "public" | "password" | "private";

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

export const AccessTypeField = () => {
  return (
    <Controller
      name="accessType"
      render={({ field }) => (
        <Field>
          <FieldLabel className="mb-2 block">公開範囲の設定</FieldLabel>
          <RadioGroup
            name="accessType"
            value={field.value}
            onValueChange={(value) => field.onChange(value as AccessType)}
            className="grid grid-cols-3 gap-3"
          >
            <AccessOption
              value="public"
              label="公開"
              icon={Globe}
              isSelected={field.value === "public"}
            />
            <AccessOption
              value="private"
              label="自分のみ"
              icon={LockIcon}
              isSelected={field.value === "private"}
            />
            <AccessOption
              value="password"
              label="パスワード"
              icon={KeyRound}
              isSelected={field.value === "password"}
            />
          </RadioGroup>
        </Field>
      )}
    />
  );
};
