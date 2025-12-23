"use client";
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
import { ShareListItemType } from "../ShareList/ShareCard";
import { FormProvider } from "react-hook-form";
import { Button } from "../ui/button";
import { HtmlField } from "./components/HtmlField";
import { TitleField } from "./components/TitleField";
import { AccessTypeField } from "./components/AccessTypeField";
import { ChangePinField } from "./components/ChangePinField";
import { PincodeField } from "./components/PincodeField";
import { SubmitButton } from "./components/SubmitButton";
import { useDialogState, useShareForm, useShareSubmit } from "./hooks";

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
  const { open, setOpen } = useDialogState(controlledOpen, onOpenChange);
  const { form, isEditMode } = useShareForm(open, initialData, initialHtml);
  const handleSubmit = useShareSubmit(form, initialData, () => setOpen(false));

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger render={children} nativeButton={false} />

      <DialogContent className="bg-card overflow-hidden border-none p-0 shadow-2xl sm:max-w-[550px]">
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                <ChangePinField
                  isEditMode={isEditMode}
                  initialAccessType={initialData?.accessType}
                />
                <PincodeField />
              </FieldGroup>
            </div>

            <DialogFooter
              className={cn(
                "flex flex-row items-center justify-end gap-2 px-8 pb-4",
              )}
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
