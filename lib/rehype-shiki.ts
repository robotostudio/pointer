/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <Its a Shiki Parser File, it'll these nested complexity> */
import type { Element, Root, Text } from "hast";
import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";
import { COPY_ICON_SVG, getFileIconSvg } from "@/lib/file-icons";
import { highlightCode } from "@/lib/shiki";

const LINE_NUMBERS_REGEX = /\blineNumbers(?:=(\d+))?\b/;
const FILENAME_REGEX = /\bfilename=["']([^"']+)["']/;

export function rehypeShiki() {
  return async function transformer(tree: Root) {
    const codeBlocks: Array<{
      node: Element;
      parent: Element | Root;
      index: number;
      code: string;
      lang: string;
      showLineNumbers: boolean;
      startLineNumber: number;
      filename: string | null;
    }> = [];

    visit(tree, "element", (node: Element, index, parent) => {
      if (
        node.tagName === "pre" &&
        node.children[0]?.type === "element" &&
        (node.children[0] as Element).tagName === "code"
      ) {
        const codeElement = node.children[0] as Element;
        const className = codeElement.properties?.className;

        let lang = "plaintext";
        if (Array.isArray(className)) {
          const langClass = className.find(
            (c) => typeof c === "string" && c.startsWith("language-")
          );
          if (langClass && typeof langClass === "string") {
            lang = langClass.replace("language-", "");
          }
        }

        const meta =
          (codeElement.data as unknown as Record<string, unknown>)?.meta ||
          codeElement.properties?.metastring ||
          "";
        const lineNumbersMatch = String(meta).match(LINE_NUMBERS_REGEX);
        const hasLineNumbers = lineNumbersMatch !== null;
        const startLineNumber = lineNumbersMatch?.[1]
          ? Number.parseInt(lineNumbersMatch[1], 10)
          : 1;

        const filenameMatch = String(meta).match(FILENAME_REGEX);
        const filename = filenameMatch?.[1] || null;

        const code = getTextContent(codeElement);

        if (parent && typeof index === "number") {
          codeBlocks.push({
            node,
            parent,
            index,
            code,
            lang,
            showLineNumbers: hasLineNumbers,
            startLineNumber,
            filename,
          });
        }
      }
    });

    await Promise.all(
      codeBlocks.map(
        async ({
          parent,
          index,
          code,
          lang,
          showLineNumbers,
          startLineNumber,
          filename,
        }) => {
          const trimmedCode = code.trim();
          const highlightedHtml = await highlightCode({
            code: trimmedCode,
            lang,
            showLineNumbers,
            startLineNumber,
          });

          const hastTree = fromHtml(highlightedHtml, { fragment: true });
          const preElement = hastTree.children[0] as Element;

          const wrapperChildren: Element[] = [];

          if (filename) {
            const headerElement: Element = {
              type: "element",
              tagName: "div",
              properties: {
                className: ["code-block-header"],
              },
              children: [
                {
                  type: "element",
                  tagName: "div",
                  properties: {
                    className: ["code-block-header-filename"],
                    "data-filename": filename,
                  },
                  children: [
                    {
                      type: "element",
                      tagName: "span",
                      properties: {
                        className: ["code-block-icon"],
                      },
                      children: fromHtml(getFileIconSvg(filename), {
                        fragment: true,
                      }).children as Element[],
                    },
                    {
                      type: "element",
                      tagName: "span",
                      properties: {},
                      children: [{ type: "text", value: filename }],
                    },
                  ],
                },
                {
                  type: "element",
                  tagName: "button",
                  properties: {
                    type: "button",
                    className: ["copy-button"],
                    "aria-label": "Copy code",
                  },
                  children: fromHtml(COPY_ICON_SVG, {
                    fragment: true,
                  }).children as Element[],
                },
              ],
            };
            wrapperChildren.push(headerElement);
          }

          if (preElement) {
            wrapperChildren.push(preElement);
          }

          if (!filename) {
            const copyButtonContainer: Element = {
              type: "element",
              tagName: "div",
              properties: {
                className: ["copy-button-container"],
              },
              children: [
                {
                  type: "element",
                  tagName: "button",
                  properties: {
                    type: "button",
                    className: ["copy-button"],
                    "aria-label": "Copy code",
                  },
                  children: fromHtml(COPY_ICON_SVG, {
                    fragment: true,
                  }).children as Element[],
                },
              ],
            };
            wrapperChildren.push(copyButtonContainer);
          }

          const wrapper: Element = {
            type: "element",
            tagName: "div",
            properties: {
              className: filename
                ? ["shiki-wrapper", "has-header"]
                : ["shiki-wrapper"],
              "data-language": lang,
              "data-line-numbers": String(showLineNumbers),
              ...(filename && { "data-filename": filename }),
            },
            children: wrapperChildren,
          };

          if (Array.isArray(parent.children)) {
            parent.children[index] = wrapper;
          }
        }
      )
    );
  };
}

function getTextContent(node: Element | Text): string {
  if (node.type === "text") {
    return node.value;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return node.children
      .map((child) => getTextContent(child as Element | Text))
      .join("");
  }
  return "";
}
