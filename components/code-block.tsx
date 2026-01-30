"use client";

import { useEffect } from "react";
import { CHECK_ICON_SVG, COPY_ICON_SVG } from "@/lib/file-icons";

export function CodeBlockEnhancer() {
  useEffect(() => {
    const wrappers = Array.from(
      document.querySelectorAll<HTMLElement>(
        ".shiki-wrapper:not([data-enhanced])"
      )
    );

    for (const wrapper of wrappers) {
      wrapper.setAttribute("data-enhanced", "true");

      const codeElement = wrapper.querySelector<HTMLElement>("pre code");
      if (!codeElement) {
        continue;
      }

      const code = codeElement.textContent || "";
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

          copyButton.classList.add("icon-exit");
          copyButton.setAttribute("data-copied", "true");
          copyButton.setAttribute("aria-label", "Copied");

          setTimeout(() => {
            copyButton.innerHTML = CHECK_ICON_SVG;
            copyButton.classList.remove("icon-exit");
          }, 150);

          setTimeout(() => {
            copyButton.classList.add("icon-exit");
            copyButton.setAttribute("data-copied", "false");
            copyButton.setAttribute("aria-label", "Copy code");

            setTimeout(() => {
              copyButton.innerHTML = COPY_ICON_SVG;
              copyButton.classList.remove("icon-exit");
            }, 150);
          }, 2000);
        });
      }
    }
  }, []);

  return null;
}
