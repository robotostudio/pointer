import type { BundledLanguage, Highlighter } from "shiki";
import { createHighlighter } from "shiki";

let highlighterPromise: Promise<Highlighter> | null = null;

const PRELOADED_LANGUAGES: BundledLanguage[] = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "json",
  "css",
  "html",
  "markdown",
  "mdx",
  "bash",
  "shell",
  "yaml",
  "python",
  "rust",
  "go",
];

export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ["vesper"],
      langs: PRELOADED_LANGUAGES,
    });
  }
  return highlighterPromise;
}

export interface HighlightOptions {
  code: string;
  lang: string;
  showLineNumbers?: boolean;
}

export async function highlightCode({
  code,
  lang,
  showLineNumbers = true,
}: HighlightOptions): Promise<string> {
  const highlighter = await getHighlighter();

  const loadedLangs = highlighter.getLoadedLanguages();
  const language = loadedLangs.includes(lang as BundledLanguage)
    ? lang
    : "plaintext";

  const html = highlighter.codeToHtml(code, {
    lang: language,
    theme: "vesper",
    transformers: showLineNumbers
      ? [
          {
            name: "line-numbers",
            line(node, line) {
              node.properties["data-line"] = line;
              if (node.properties.class) {
                node.properties.class += " line";
              } else {
                node.properties.class = "line";
              }
            },
          },
        ]
      : [],
  });

  return html;
}
