import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";
import { FieldLabel } from "./ui/field";

interface PinCodeInputProps {
  length?: number;
  value?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  className?: string;
}

export const PinCodeInput: React.FC<PinCodeInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  className,
}) => {
  // 支持受控和非受控模式
  const [internalValues, setInternalValues] = useState<string[]>(Array(length).fill(""));
  const isControlled = value !== undefined;
  const values = isControlled
    ? Array.from({ length }, (_, i) => value[i] || "")
    : internalValues;

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 确保 refs 数组长度正确
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const updateValues = (newValues: string[]) => {
    if (!isControlled) {
      setInternalValues(newValues);
    }
    const fullCode = newValues.join("");
    onChange?.(fullCode);
    if (fullCode.length === length && onComplete) {
      onComplete(fullCode);
    }
  };

  const handleChange = (index: number, inputValue: string) => {
    // 仅允许数字
    const digit = inputValue.replace(/[^0-9]/g, "").slice(-1);

    const newValues = [...values];
    newValues[index] = digit;
    updateValues(newValues);

    // 自动向后跳转
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
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
        updateValues(newValues);
        inputRefs.current[index - 1]?.focus();
      } else {
        // 否则只清空当前格
        const newValues = [...values];
        newValues[index] = "";
        updateValues(newValues);
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
      updateValues(newValues);

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
            name={`pin-${index}`}
            inputMode="numeric"
            enterKeyHint="next"
            autoComplete="one-time-code"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            placeholder=""
            className={cn(
              "h-14 w-full rounded-xl border text-center text-xl font-medium transition-all sm:h-16 sm:text-2xl",
              "bg-background shadow-sm ring-0 outline-none",
              value
                ? "border-primary bg-primary/5 text-primary"
                : "border-primary/20 focus:border-primary",
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default PinCodeInput;
