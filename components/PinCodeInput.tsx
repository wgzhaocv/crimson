import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { FieldLabel } from "./ui/field";

interface PinCodeInputProps {
  length?: number;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  className?: string;
}

export const PinCodeInput: React.FC<PinCodeInputProps> = ({
  length = 6,
  onChange,
  onComplete,
  className,
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 确保 refs 数组长度正确
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    // 仅允许数字
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    const fullCode = newValues.join("");
    if (onChange) onChange(fullCode);

    // 自动向后跳转
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // 完成检查
    if (fullCode.length === length && onComplete) {
      onComplete(fullCode);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace") {
      if (!values[index] && index > 0) {
        // 当前格为空且不是第一格时，回退到上一格
        const newValues = [...values];
        newValues[index - 1] = "";
        setValues(newValues);
        inputRefs.current[index - 1]?.focus();

        if (onChange) onChange(newValues.join(""));
      } else {
        // 否则只清空当前格
        const newValues = [...values];
        newValues[index] = "";
        setValues(newValues);
        if (onChange) onChange(newValues.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);

    if (pastedData) {
      const newValues = [...values];
      pastedData.split("").forEach((char, i) => {
        if (i < length) newValues[i] = char;
      });
      setValues(newValues);

      const fullCode = newValues.join("");
      if (onChange) onChange(fullCode);
      if (fullCode.length === length && onComplete) onComplete(fullCode);

      // 聚焦到最后一个输入的下一格或最后一格
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className={cn("flex w-full flex-col gap-4", className)}>
      <FieldLabel className="mb-1 flex items-center gap-2">
        <div className="bg-primary/10 rounded-full p-1.5">
          <ShieldCheck className="text-primary h-4 w-4" />
        </div>
        <span className="text-primary text-sm font-bold tracking-tight">
          6桁のアクセスコードを設定
        </span>
      </FieldLabel>

      <div className="flex justify-between gap-2 sm:gap-3">
        {values.map((value, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="\d{1}"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            placeholder="•"
            className={cn(
              "h-14 w-full rounded-xl border-2 text-center text-xl font-black transition-all outline-none sm:h-16 sm:text-2xl",
              "bg-background shadow-sm",
              "placeholder:text-muted-foreground/30",
              value
                ? "border-primary bg-primary/2 text-primary shadow-[0_0_15px_-5px_rgba(var(--primary),0.3)]"
                : "border-border/60 focus:border-primary/50 focus:ring-primary/10 focus:ring-4",
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default PinCodeInput;
