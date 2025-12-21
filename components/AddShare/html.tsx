"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { UploadCloud, Clipboard, ExpandIcon } from "lucide-react";
import { useState, useRef, useEffect, startTransition } from "react";
import { Textarea } from "../ui/textarea";
import { parseHTML } from "@/lib/parseHTML";
import { toast } from "sonner";
import { Input } from "../ui/input";

const useHtmlValid = (html: string) => {
  const [isValid, setIsValid] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setTimeout(() => {
      startTransition(() => {
        const { isHTML } = parseHTML(html);
        if (isHTML) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      });
    }, 200);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [html]);

  return isValid;
};

export const HtmlSection = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const [title, setTitle] = useState<string>("");
  const [isTouched, setIsTouched] = useState(false);
  const isValid = useHtmlValid(htmlContent);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      setHtmlContent(content);
      const { title } = parseHTML(content);
      setTitle(title ?? "");
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
    // 重置input的value，以便可以再次选择同一个文件
    e.target.value = "";
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setHtmlContent(text);
      const { title } = parseHTML(text);
      setTitle(title ?? "");
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
      setTitle(extractedTitle);
    }
  };
  return (
    <>
      <Field>
        <div className="mb-1 flex items-center justify-between">
          <FieldLabel htmlFor="html">HTML内容</FieldLabel>
          <div className="flex gap-2">
            <input
              type="file"
              accept=".html"
              className="hidden"
              ref={fileInputRef}
              onChange={onFileChange}
            />
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
          value={htmlContent}
          onChange={(e) => setHtmlContent(e.target.value)}
          onBlur={() => setIsTouched(true)}
          onPaste={handleTextareaPaste}
          placeholder="ここにHTMLコードを貼り付けてください..."
          className="leading-extended bg-background/40 hover:border-primary/50 focus:border-primary focus:bg-background h-[160px] resize-none overflow-auto p-4 font-mono text-[13px] transition-all"
        />
        <FieldError>
          {isTouched && !isValid ? "HTMLコードが無効です" : ""}
        </FieldError>
        <FieldDescription>
          ※ .htmlファイルをアップロードすると、自動的にテキストが抽出されます。
        </FieldDescription>
      </Field>
      {/* ページタイトル */}
      <Field>
        <FieldLabel htmlFor="title">タイトル</FieldLabel>
        <Input
          id="title"
          name="title"
          placeholder="例: マイ・ポートフォリオ 2024"
          className="h-11"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>
    </>
  );
};
