"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { CopyButton } from "@/components/copy-button";

interface CodeBlockMount {
  placeholder: HTMLElement;
  code: string;
}

export function CodeBlockEnhancer() {
  const [mounts, setMounts] = useState<CodeBlockMount[]>([]);

  useEffect(() => {
    const placeholders = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".copy-button-placeholder:not([data-mounted])"
      )
    );

    const newMounts: CodeBlockMount[] = [];

    for (const placeholder of placeholders) {
      placeholder.setAttribute("data-mounted", "true");

      const wrapper = placeholder.closest(".shiki-wrapper");
      const codeElement = wrapper?.querySelector<HTMLElement>("pre code");
      const code = codeElement?.textContent ?? "";

      if (code) {
        newMounts.push({ placeholder, code });
      }
    }

    if (newMounts.length > 0) {
      setMounts((prev) => [...prev, ...newMounts]);
    }

    return () => {
      for (const placeholder of placeholders) {
        placeholder.removeAttribute("data-mounted");
      }
      setMounts((prev) =>
        prev.filter((mount) => !placeholders.includes(mount.placeholder))
      );
    };
  }, []);

  return (
    <>
      {mounts.map((mount, index) =>
        createPortal(
          <CopyButton code={mount.code} />,
          mount.placeholder,
          `copy-button-${index}`
        )
      )}
    </>
  );
}
