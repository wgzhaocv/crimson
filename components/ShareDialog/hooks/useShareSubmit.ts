import { ShareListItemType } from "@/components/ShareList/ShareCard";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { ShareFormValues } from "./useShareForm";

export const useShareSubmit = (
  form: UseFormReturn<ShareFormValues>,
  initialData?: ShareListItemType,
  onSuccess?: () => void,
) => {
  const isEditMode = !!initialData;
  const queryClient = useQueryClient();

  const handleSubmit = useCallback(
    async (data: ShareFormValues) => {
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
        onSuccess?.();
        form.reset();

        // 刷新列表和 content 缓存
        queryClient.invalidateQueries({ queryKey: ["shares"] });
        if (isEditMode) {
          queryClient.invalidateQueries({
            queryKey: ["share", initialData.id],
          });
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("エラーが発生しました");
        }
      }
    },
    [isEditMode, initialData, form, queryClient, onSuccess],
  );

  return handleSubmit;
};
