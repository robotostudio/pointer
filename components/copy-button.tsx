"use client";

import { useCallback, useState } from "react";
import { CheckIcon, CopyIcon } from "@/components/icons/copy-icons";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  code: string;
  className?: string;
}

export function CopyButton({ code, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = code;
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className={cn(
        "copy-button rounded-md bg-transparent p-1.5 text-neutral-500 transition-colors duration-150 ease-out hover:bg-white/5 hover:text-neutral-300",
        copied && "bg-emerald-500/10 text-emerald-500",
        className
      )}
      onClick={handleCopy}
      type="button"
    >
      <span className="relative flex items-center justify-center">
        <CopyIcon
          className={cn(
            "transition-all duration-150 ease-out",
            copied && "scale-50 opacity-0 blur-sm"
          )}
        />
        <CheckIcon
          className={cn(
            "absolute transition-all duration-150 ease-out",
            !copied && "scale-50 text-emerald-300 opacity-0 blur-sm"
          )}
        />
      </span>
    </button>
  );
}
