import { ShareListItemType } from "@/components/ShareList/ShareCard";
import { parseHTML } from "@/lib/parseHTML";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

const shareSchema = z
  .object({
    html: z.string().min(1, "HTMLコンテンツは必須です"),
    title: z.string(),
    accessType: z.enum(["public", "password", "private"]),
    changePin: z.boolean(),
    pin: z.string(),
  })
  .superRefine((data, ctx) => {
    // pin 验证：accessType 是 password 且 changePin 为 true 时必填
    if (data.accessType === "password" && data.changePin && !data.pin) {
      ctx.addIssue({
        code: "custom",
        message: "パスワード保護にはPINが必要です",
        path: ["pin"],
      });
    }
  });

export type ShareFormValues = z.infer<typeof shareSchema>;

/** 表单初始化与副作用管理 */
export const useShareForm = (
  open: boolean,
  initialData?: ShareListItemType,
  initialHtml?: string,
) => {
  const isEditMode = !!initialData;

  const form = useForm<ShareFormValues>({
    resolver: zodResolver(shareSchema),
    defaultValues: {
      html: initialHtml ?? "",
      title: initialData?.title ?? "",
      accessType: initialData?.accessType ?? "public",
      changePin: !isEditMode,
      pin: "",
    },
  });

  // 对话框打开时重置表单为最新的 initialData
  useEffect(() => {
    if (open) {
      form.reset({
        html: initialHtml ?? "",
        title: initialData?.title ?? "",
        accessType: initialData?.accessType ?? "public",
        changePin: !isEditMode,
        pin: "",
      });
    }
  }, [open, initialData, initialHtml, isEditMode, form]);

  // 当 initialHtml 变化时更新表单（用于拖拽）
  useEffect(() => {
    if (initialHtml) {
      form.setValue("html", initialHtml);
      const { title } = parseHTML(initialHtml);
      if (title) {
        form.setValue("title", title);
      }
    }
  }, [initialHtml, form]);

  // 编辑模式下，从非 password 切换到 password 时，自动设置 changePin 为 true
  const currentAccessType = useWatch({
    control: form.control,
    name: "accessType",
  });
  useEffect(() => {
    if (
      isEditMode &&
      initialData?.accessType !== "password" &&
      currentAccessType === "password"
    ) {
      form.setValue("changePin", true);
    }
  }, [isEditMode, initialData?.accessType, currentAccessType, form]);

  return { form, isEditMode };
};
