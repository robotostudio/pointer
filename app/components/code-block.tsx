"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getFileIcon } from "@/app/lib/file-icons";

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

function FileIcon({ filename }: { filename: string }) {
  const Icon = getFileIcon(filename);
  return <Icon size={14} />;
}

interface CodeBlockPortal {
  container: HTMLElement;
  code: string;
  type: "copy-button" | "icon";
  filename?: string;
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
      const filename = wrapper.getAttribute("data-filename");

      if (filename) {
        const iconContainer = wrapper.querySelector(".code-block-icon");
        if (iconContainer) {
          newPortals.push({
            container: iconContainer as HTMLElement,
            code,
            type: "icon",
            filename,
          });
        }

        const copyContainer = wrapper.querySelector(
          ".code-block-header .copy-button-container"
        );
        if (copyContainer) {
          newPortals.push({
            container: copyContainer as HTMLElement,
            code,
            type: "copy-button",
          });
        }
      } else {
        const container = document.createElement("div");
        container.className = "copy-button-container";
        wrapper.appendChild(container);
        newPortals.push({ container, code, type: "copy-button" });
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
          portal.type === "icon" && portal.filename ? (
            <FileIcon filename={portal.filename} />
          ) : (
            <CopyButton code={portal.code} />
          ),
          portal.container,
          `code-block-${index}`
        )
      )}
    </>
  );
}
