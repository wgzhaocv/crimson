"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { FieldGroup } from "../ui/field";
import { HtmlSection, type HtmlSectionHandle } from "./html";
import { AccessTypeSection } from "./accessType";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";
import { useQueryClient } from "@tanstack/react-query";

export type { HtmlSectionHandle };

export const AddShareDialog = ({
  children,
  ref,
  open,
  setOpen,
}: {
  children: React.ReactElement;
  ref?: React.Ref<HtmlSectionHandle>;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const queryClient = useQueryClient();
  const internalRef = useRef<HtmlSectionHandle>(null);
  const htmlSectionRef = ref ?? internalRef;

  const onSave = async (formData: FormData) => {
    try {
      const res = await fetch("/api/share", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "エラーが発生しました");
        return;
      }

      toast.success("保存しました");
      setOpen(false);
      // clear cache from react query
      queryClient.invalidateQueries({ queryKey: ["shares"] });
    } catch {
      toast.error("エラーが発生しました");
    }
  };
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={children} />

      <DialogContent className="bg-card overflow-hidden border-none p-0 shadow-2xl sm:max-w-[550px]">
        <form action={onSave}>
          <DialogHeader className="p-8 pb-4">
            <DialogTitle>HTMLをアップロード</DialogTitle>
            <DialogDescription>
              HTMLファイルを選択するか、コードを直接入力してください。
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[70vh] space-y-8 overflow-y-auto px-8 py-4">
            <FieldGroup>
              {/* HTMLコンテンツ */}
              <HtmlSection ref={htmlSectionRef} />

              {/* 公開範囲の設定（省略せず以前のロジックを維持） */}
              <AccessTypeSection />
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
      </DialogContent>
    </Dialog>
  );
};

export const AddShare = () => {
  const [open, setOpen] = useState(false);
  return (
    <AddShareDialog open={open} setOpen={setOpen}>
      <Button className="shadow-primary/20 bg-primary text-primary-foreground flex h-12 items-center gap-2 px-6 font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90">
        <Plus className="h-5 w-5" />
        HTMLを追加
      </Button>
    </AddShareDialog>
  );
};

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      size="sm"
      disabled={pending}
      className="h-9 px-6 font-bold"
    >
      {pending ? <Spinner /> : "保存"}
    </Button>
  );
};
