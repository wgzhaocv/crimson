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
import { HtmlSection } from "./html";
import { AccessTypeSection } from "./accessType";
import { Spinner } from "../ui/spinner";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { useFormStatus } from "react-dom";

export const AddShare = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onSave = async (formData: FormData) => {
    const html = formData.get("html");
    const title = formData.get("title");
    const accessType = formData.get("accessType");
    const pin = formData.get("pin");
    console.log(Object.fromEntries(formData));
    toast.success(html + " " + title + " " + accessType + " " + pin);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("保存しました");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("エラーが発生しました");
      }
    } finally {
      setIsOpen(false);
    }
  };
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger
        render={
          <Button className="shadow-primary/20 bg-primary text-primary-foreground flex h-12 items-center gap-2 px-6 font-black tracking-widest uppercase shadow-lg transition-all hover:opacity-90">
            <Plus className="h-5 w-5" />
            HTMLを追加
          </Button>
        }
      ></DialogTrigger>

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
              <HtmlSection />

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
              onClick={() => setIsOpen(false)}
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
