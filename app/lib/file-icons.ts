import type { LucideIcon } from "lucide-react";
import {
  File,
  FileCode2,
  FileJson,
  FileText,
  Globe,
  Palette,
  Terminal,
} from "lucide-react";

export function getFileIcon(filename: string): LucideIcon {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
    case "tsx":
    case "js":
    case "jsx":
    case "mjs":
      return FileCode2;
    case "json":
      return FileJson;
    case "md":
    case "mdx":
      return FileText;
    case "css":
    case "scss":
      return Palette;
    case "sh":
    case "bash":
    case "zsh":
      return Terminal;
    case "html":
      return Globe;
    default:
      return File;
  }
}
