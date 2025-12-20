"use client";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field";
import { UploadCloud, Clipboard } from "lucide-react";
import { useState, useRef } from "react";
import { Textarea } from "../ui/textarea";

export const HtmlSection = () => {
  const [htmlContent, setHtmlContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 处理文件读取逻辑
  const handleFileRead = (file: File) => {
    if (!file) return;
    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      // 可以在这里添加错误提示，例如：HTMLファイルのみ対応しています
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setHtmlContent(content);
    };
    reader.readAsText(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileRead(file);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setHtmlContent(text);
    } catch (err) {
      console.error("Failed to read clipboard", err);
    }
  };
  return (
    <Field>
      <div className="mb-1 flex items-center justify-between">
        <FieldLabel htmlFor="html-body">HTML内容</FieldLabel>
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
        </div>
      </div>

      <Textarea
        id="html-body"
        value={htmlContent}
        onChange={(e) => setHtmlContent(e.target.value)}
        placeholder="ここにHTMLコードを入力してください..."
        className="leading-extended bg-background/40 hover:border-primary/50 focus:border-primary focus:bg-background min-h-[160px] resize-none p-4 font-mono text-[13px] transition-all"
      />
      <FieldDescription>
        ※ .htmlファイルをアップロードすると、自動的にテキストが抽出されます。
      </FieldDescription>
    </Field>
  );
};
