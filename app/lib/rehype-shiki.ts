import type { Element, Root, Text } from "hast";
import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";
import { highlightCode } from "./shiki";

interface RehypeShikiOptions {
  showLineNumbers?: boolean;
}

export function rehypeShiki(options: RehypeShikiOptions = {}) {
  const { showLineNumbers = true } = options;

  return async function transformer(tree: Root) {
    const codeBlocks: Array<{
      node: Element;
      parent: Element | Root;
      index: number;
      code: string;
      lang: string;
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

        const code = getTextContent(codeElement);

        if (parent && typeof index === "number") {
          codeBlocks.push({ node, parent, index, code, lang });
        }
      }
    });

    await Promise.all(
      codeBlocks.map(async ({ parent, index, code, lang }) => {
        const highlightedHtml = await highlightCode({
          code: code.trim(),
          lang,
          showLineNumbers,
        });

        const hastTree = fromHtml(highlightedHtml, { fragment: true });
        const preElement = hastTree.children[0] as Element;

        const wrapper: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["shiki-wrapper"],
            "data-language": lang,
          },
          children: preElement ? [preElement] : [],
        };

        if (Array.isArray(parent.children)) {
          parent.children[index] = wrapper;
        }
      })
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
