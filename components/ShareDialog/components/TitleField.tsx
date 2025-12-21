import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller } from "react-hook-form";

export const TitleField = () => {
  return (
    <Controller
      name="title"
      render={({ field }) => (
        <Field>
          <FieldLabel htmlFor="title">タイトル</FieldLabel>
          <Input
            id="title"
            name="title"
            placeholder="例: マイ・ポートフォリオ 2024"
            className="h-11"
            value={field.value}
            onChange={field.onChange}
          />
        </Field>
      )}
    />
  );
};
