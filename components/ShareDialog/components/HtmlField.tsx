import { Textarea } from "@/components/ui/textarea";
import { parseHTML } from "@/lib/parseHTML";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UploadCloud, ExpandIcon, Clipboard } from "lucide-react";
import { useEffect, useRef } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const useSetHtmlContent = () => {
  const { setValue } = useFormContext();
  return (html: string) => {
    setValue("html", html);
    const { title } = parseHTML(html);
    if (title) {
      setValue("title", title);
    }
  };
};

// 获取 share content 的 hook，5分钟缓存
export const fetchShareContent = async (id?: string): Promise<string> => {
  if (!id) return "";
  const res = await fetch(`/api/share/${id}`);
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || "コンテンツの取得に失敗しました");
  }
  const data = await res.json();
  return data.content;
};

export const useShareContent = (id?: string) => {
  const { setValue } = useFormContext();
  const { data, isLoading } = useQuery({
    queryKey: ["share", id],
    queryFn: () => fetchShareContent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5分钟
    gcTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data) {
      setValue("html", data);
    }
  }, [data, setValue]);

  return { isLoading: !!id && isLoading };
};

const HtmlFieldSkeleton = () => (
  <Field>
    <div className="mb-1 flex items-center justify-between">
      <Skeleton className="h-4 w-20" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-8" />
      </div>
    </div>
    <Skeleton className="h-[160px] w-full rounded-md" />
    <Skeleton className="mt-2 h-4 w-3/4" />
  </Field>
);

export const HtmlField = ({ id }: { id?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSetHtmlContent = useSetHtmlContent();
  const { isLoading } = useShareContent(id);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      handleSetHtmlContent(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("クリップボードの読み取りに失敗しました");
      }
    }
  };

  const handleTextareaPaste = (
    e: React.ClipboardEvent<HTMLTextAreaElement>,
  ) => {
    const pastedText = e.clipboardData.getData("text");
    const { title: extractedTitle, isHTML } = parseHTML(pastedText);
    if (isHTML && extractedTitle) {
      e.preventDefault();
      handleSetHtmlContent(pastedText);
    }
  };

  if (isLoading) {
    return <HtmlFieldSkeleton />;
  }

  return (
    <>
      <FileInput fileInputRef={fileInputRef} />
      <Controller
        name="html"
        render={({ field, fieldState }) => (
          <Field>
            <div className="mb-1 flex items-center justify-between">
              <FieldLabel htmlFor="html">HTML内容</FieldLabel>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 text-[11px] font-medium"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <UploadCloud className="mr-1.5 h-3.5 w-3.5" />
                  ファイル選択
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 px-3 text-[11px] font-medium"
                  onClick={handlePaste}
                >
                  <Clipboard className="mr-1.5 h-3.5 w-3.5" />
                  貼り付け
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 px-2 text-[11px] font-medium"
                >
                  <ExpandIcon className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Textarea
              id="html"
              name="html"
              value={field.value}
              onChange={field.onChange}
              onPaste={handleTextareaPaste}
              placeholder="ここにHTMLコードを貼り付けてください..."
              className="leading-extended bg-background/40 hover:border-primary/50 focus:border-primary focus:bg-background h-[160px] resize-none overflow-auto p-4 font-mono text-[13px] transition-all"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            <FieldDescription>
              ※.htmlファイルをアップロードすると、自動的にテキストが抽出されます。
            </FieldDescription>
          </Field>
        )}
      />
    </>
  );
};

const FileInput = ({
  fileInputRef,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  const handleSetHtmlContent = useSetHtmlContent();
  // 处理文件读取逻辑
  const handleFileRead = (file: File) => {
    if (!file) return;
    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      // 可以在这里添加错误提示，例如：HTMLファイルのみ対応しています
      toast.error("HTMLファイルのみ対応しています");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      handleSetHtmlContent(content);
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
    // 重置input的value，以便可以再次选择同一个文件
    e.target.value = "";
  };

  return (
    <input
      type="file"
      accept=".html"
      className="hidden"
      ref={fileInputRef}
      onChange={onFileChange}
    />
  );
};
