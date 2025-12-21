import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { FieldGroup } from "../ui/field";
import { useEffect, useState } from "react";
import { ShareListItemType } from "../ShareList/ShareCard";
import { parseHTML } from "@/lib/parseHTML";
import * as z from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { HtmlField } from "./components/HtmlField";
import { TitleField } from "./components/TitleField";
import { AccessTypeField } from "./components/AccessTypeField";
import { ChangePinField } from "./components/ChangePinField";
import { PincodeField } from "./components/PincodeField";
import { SubmitButton } from "./components/SubmitButton";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// 统一的 schema，用 superRefine 处理验证逻辑
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

export const ShareDialog = ({
  children,
  initialData,
  initialHtml,
  open: controlledOpen,
  onOpenChange,
}: {
  children: React.ReactElement;
  initialData?: ShareListItemType;
  initialHtml?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = isControlled ? onOpenChange! : setInternalOpen;

  const isEditMode = !!initialData;
  const queryClient = useQueryClient();

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

  const onSubmit = async (data: ShareFormValues) => {
    try {
      const url = isEditMode ? `/api/share/${initialData.id}` : "/api/share";
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          html: data.html,
          title: data.title || null,
          accessType: data.accessType,
          changePin: data.changePin,
          pin: data.pin || null,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error ?? "エラーが発生しました");
        return;
      }

      toast.success(isEditMode ? "更新しました" : "保存しました");
      setOpen(false);
      form.reset();

      // 刷新列表和 content 缓存
      queryClient.invalidateQueries({ queryKey: ["shares"] });
      if (isEditMode) {
        queryClient.invalidateQueries({ queryKey: ["share", initialData.id] });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("エラーが発生しました");
      }
    }
  };

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={children} />

      <DialogContent className="bg-card overflow-hidden border-none p-0 shadow-2xl sm:max-w-[550px]">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader className="p-8 pb-4">
              <DialogTitle>
                HTMLを{isEditMode ? "更新" : "アップロード"}
              </DialogTitle>
              <DialogDescription>
                HTMLファイルを選択するか、コードを直接入力してください。
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] space-y-8 overflow-y-auto px-8 py-4">
              <FieldGroup>
                <HtmlField id={initialData?.id} />
                <TitleField />
                <AccessTypeField />
                <ChangePinField isEditMode={isEditMode} />
                <PincodeField />
              </FieldGroup>
            </div>

            <DialogFooter
              className={cn("flex items-center justify-end gap-2 px-8 pb-4")}
            >
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-9 px-4"
                onClick={() => setOpen(false)}
              >
                キャンセル
              </Button>
              <SubmitButton />
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};
