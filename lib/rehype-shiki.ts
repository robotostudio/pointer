/** biome-ignore-all lint/complexity/noExcessiveCognitiveComplexity: <Its a Shiki Parser File, it'll these nested complexity> */
import type { Element, Root, Text } from "hast";
import { fromHtml } from "hast-util-from-html";
import { visit } from "unist-util-visit";
import { getFileIconSvg } from "@/lib/file-icons";
import { highlightCode } from "@/lib/shiki";

const LINE_NUMBERS_REGEX = /\blineNumbers(?:=(\d+))?\b/;
const FILENAME_REGEX = /\bfilename=["']([^"']+)["']/;
const TAB_REGEX = /\btab=["']([^"']+)["']/;
const GROUP_ID_REGEX = /\bgroupId=["']([^"']+)["']/;

let tabGroupCounter = 0;

interface CodeBlockInfo {
  node: Element;
  parent: Element | Root;
  index: number;
  code: string;
  lang: string;
  showLineNumbers: boolean;
  startLineNumber: number;
  filename: string | null;
  tab: string | null;
  groupId: string | null;
}

interface TabGroup {
  blocks: CodeBlockInfo[];
  groupId: string;
  parentNode: Element | Root;
  startIndex: number;
}

export function rehypeShiki() {
  return async function transformer(tree: Root) {
    const codeBlocks: CodeBlockInfo[] = [];

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
        const metaString = String(meta);

        const lineNumbersMatch = metaString.match(LINE_NUMBERS_REGEX);
        const hasLineNumbers = lineNumbersMatch !== null;
        const startLineNumber = lineNumbersMatch?.[1]
          ? Number.parseInt(lineNumbersMatch[1], 10)
          : 1;

        const filenameMatch = metaString.match(FILENAME_REGEX);
        const filename = filenameMatch?.[1] || null;

        const tabMatch = metaString.match(TAB_REGEX);
        const tab = tabMatch?.[1] || null;

        const groupIdMatch = metaString.match(GROUP_ID_REGEX);
        const groupId = groupIdMatch?.[1] || null;

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
            tab,
            groupId,
          });
        }
      }
    });

    // Group consecutive tab blocks
    const { groups, standalone } = groupConsecutiveTabBlocks(codeBlocks);

    // Process tab groups
    for (const group of groups) {
      const tabPanels: Element[] = [];
      const tabLabels: string[] = [];

      for (let i = 0; i < group.blocks.length; i++) {
        const block = group.blocks[i];
        const wrapper = await createCodeBlockWrapper(block);
        tabLabels.push(block.tab as string);

        const panel: Element = {
          type: "element",
          tagName: "div",
          properties: {
            className: ["code-tab-panel"],
            "data-tab": block.tab,
            "data-active": String(i === 0),
          },
          children: [wrapper],
        };
        tabPanels.push(panel);
      }

      const tabsContainer: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: ["code-tabs-container"],
          "data-group-id": group.groupId,
        },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: {
              className: ["code-tabs-list"],
              role: "tablist",
            },
            children: tabLabels.map((label, i) => ({
              type: "element",
              tagName: "button",
              properties: {
                className:
                  i === 0 ? ["code-tab", "code-tab-active"] : ["code-tab"],
                role: "tab",
                "aria-selected": String(i === 0),
                "data-tab": label,
                type: "button",
              },
              children: [{ type: "text", value: label }],
            })),
          },
          ...tabPanels,
        ],
      };

      // Replace first block with container
      if (Array.isArray(group.parentNode.children)) {
        group.parentNode.children[group.startIndex] = tabsContainer;

        // Mark subsequent blocks for removal (set to null, then filter)
        for (let i = 1; i < group.blocks.length; i++) {
          const blockIndex = group.blocks[i].index;
          (group.parentNode.children as (Element | Text | null)[])[blockIndex] =
            null;
        }
      }
    }

    // Process standalone blocks BEFORE filtering nulls (indices are still valid)
    await Promise.all(
      standalone.map(async (block) => {
        const wrapper = await createCodeBlockWrapper(block);
        if (Array.isArray(block.parent.children)) {
          block.parent.children[block.index] = wrapper;
        }
      })
    );

    // Remove null entries from all parents that had tab groups
    const processedParents = new Set(groups.map((g) => g.parentNode));
    for (const parent of Array.from(processedParents)) {
      if (Array.isArray(parent.children)) {
        parent.children = parent.children.filter(
          (child) => child !== null
        ) as typeof parent.children;
      }
    }
  };
}

function groupConsecutiveTabBlocks(codeBlocks: CodeBlockInfo[]): {
  groups: TabGroup[];
  standalone: CodeBlockInfo[];
} {
  const groups: TabGroup[] = [];
  const standalone: CodeBlockInfo[] = [];
  const processed = new Set<number>();

  for (let i = 0; i < codeBlocks.length; i++) {
    if (processed.has(i)) {
      continue;
    }

    const block = codeBlocks[i];

    if (!block.tab) {
      standalone.push(block);
      processed.add(i);
      continue;
    }

    // Start a new potential group
    const groupBlocks: CodeBlockInfo[] = [block];
    let explicitGroupId = block.groupId;
    processed.add(i);

    // Look for consecutive tab blocks in the same parent
    for (let j = i + 1; j < codeBlocks.length; j++) {
      const nextBlock = codeBlocks[j];

      // Must be same parent
      if (nextBlock.parent !== block.parent) {
        break;
      }

      // Must have tab attribute
      if (!nextBlock.tab) {
        break;
      }

      // Check if consecutive (only whitespace text nodes between)
      const lastBlock = groupBlocks.at(-1);
      if (!lastBlock) {
        break;
      }
      if (
        !areIndicesConsecutive(block.parent, lastBlock.index, nextBlock.index)
      ) {
        break;
      }

      // Use explicit groupId if provided
      if (nextBlock.groupId) {
        explicitGroupId = nextBlock.groupId;
      }

      groupBlocks.push(nextBlock);
      processed.add(j);
    }

    // Only create a group if we have multiple blocks
    if (groupBlocks.length > 1) {
      tabGroupCounter++;
      groups.push({
        blocks: groupBlocks,
        groupId: explicitGroupId || `auto-${tabGroupCounter}`,
        parentNode: block.parent,
        startIndex: block.index,
      });
    } else {
      // Single tab block - treat as standalone (ignore tab attribute)
      standalone.push(block);
    }
  }

  return { groups, standalone };
}

function areIndicesConsecutive(
  parent: Element | Root,
  index1: number,
  index2: number
): boolean {
  for (let k = index1 + 1; k < index2; k++) {
    const node = parent.children[k];
    // Allow only whitespace text nodes between
    if (node.type !== "text" || (node as Text).value.trim() !== "") {
      return false;
    }
  }
  return true;
}

async function createCodeBlockWrapper(block: CodeBlockInfo): Promise<Element> {
  const { code, lang, showLineNumbers, startLineNumber, filename } = block;

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
          tagName: "div",
          properties: {
            className: ["copy-button-placeholder"],
          },
          children: [],
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
          tagName: "div",
          properties: {
            className: ["copy-button-placeholder"],
          },
          children: [],
        },
      ],
    };
    wrapperChildren.push(copyButtonContainer);
  }

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: filename ? ["shiki-wrapper", "has-header"] : ["shiki-wrapper"],
      "data-language": lang,
      "data-line-numbers": String(showLineNumbers),
      ...(filename && { "data-filename": filename }),
    },
    children: wrapperChildren,
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
