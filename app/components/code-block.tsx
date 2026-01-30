"use client";

import { useEffect } from "react";
import { CHECK_ICON_SVG, COPY_ICON_SVG } from "@/app/lib/file-icons";

export function CodeBlockEnhancer() {
  useEffect(() => {
    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".shiki-wrapper:not([data-enhanced])"
      )
    );

    for (const wrapper of wrappers) {
      wrapper.setAttribute("data-enhanced", "true");

      const encodedCode = wrapper.getAttribute("data-code");
      if (!encodedCode) {
        continue;
      }

      const code = decodeURIComponent(encodedCode);
      const copyButton =
        wrapper.querySelector<HTMLButtonElement>(".copy-button");

      if (copyButton) {
        copyButton.addEventListener("click", async () => {
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

          copyButton.setAttribute("data-copied", "true");
          copyButton.setAttribute("aria-label", "Copied");
          copyButton.innerHTML = CHECK_ICON_SVG;

          setTimeout(() => {
            copyButton.setAttribute("data-copied", "false");
            copyButton.setAttribute("aria-label", "Copy code");
            copyButton.innerHTML = COPY_ICON_SVG;
          }, 2000);
        });
      }
    }
  }, []);

  return null;
}
