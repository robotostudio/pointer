"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
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
  }

  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return (
    <button
      aria-label={copied ? "Copied" : "Copy code"}
      className="copy-button"
      data-copied={copied}
      onClick={handleCopy}
      type="button"
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
    </button>
  );
}

interface CodeBlockPortal {
  container: HTMLElement;
  code: string;
}

export function CodeBlockEnhancer() {
  const [portals, setPortals] = useState<CodeBlockPortal[]>([]);

  useEffect(() => {
    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".shiki-wrapper:not([data-enhanced])"
      )
    );

    const newPortals: CodeBlockPortal[] = [];

    for (const wrapper of wrappers) {
      wrapper.setAttribute("data-enhanced", "true");

      const encodedCode = wrapper.getAttribute("data-code");
      if (!encodedCode) {
        continue;
      }

      const code = decodeURIComponent(encodedCode);
      const hasHeader = wrapper.classList.contains("has-header");

      let container: HTMLElement | null = null;

      if (hasHeader) {
        container = wrapper.querySelector(
          ".code-block-header .copy-button-container"
        );
      } else {
        container = document.createElement("div");
        container.className = "copy-button-container";
        wrapper.appendChild(container);
      }

      if (container) {
        newPortals.push({ container, code });
      }
    }

    if (newPortals.length > 0) {
      setPortals((prev) => [...prev, ...newPortals]);
    }
  }, []);

  return (
    <>
      {portals.map((portal, index) =>
        createPortal(
          <CopyButton code={portal.code} />,
          portal.container,
          `code-block-${index}`
        )
      )}
    </>
  );
}
