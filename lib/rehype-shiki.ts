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
  code: string;
  filename: string | null;
  groupId: string | null;
  index: number;
  lang: string;
  node: Element;
  parent: Element | Root;
  showLineNumbers: boolean;
  startLineNumber: number;
  tab: string | null;
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

        const codeData = codeElement.data as
          | Record<string, unknown>
          | undefined;
        const meta = codeData?.meta || codeElement.properties?.metastring || "";
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

        if (
          parent &&
          typeof index === "number" &&
          (parent.type === "element" || parent.type === "root")
        ) {
          codeBlocks.push({
            code,
            filename,
            groupId,
            index,
            lang,
            node,
            parent,
            showLineNumbers: hasLineNumbers,
            startLineNumber,
            tab,
          });
        }
      }
    });

    // Group consecutive tab blocks
    const { groups, standalone } = groupConsecutiveTabBlocks(codeBlocks);

    // Highlight every grouped block up front: awaiting inside the loop below
    // would serialize the groups for no reason.
    const groupWrappers = await Promise.all(
      groups.map((group) =>
        Promise.all(group.blocks.map((block) => createCodeBlockWrapper(block)))
      )
    );

    // Process tab groups
    for (const [groupIndex, group] of groups.entries()) {
      const tabPanels: Element[] = [];
      const tabLabels: string[] = [];
      const wrappers = groupWrappers[groupIndex];

      for (const [i, block] of group.blocks.entries()) {
        tabLabels.push(block.tab as string);

        const panel: Element = {
          children: [wrappers[i]],
          properties: {
            className: ["code-tab-panel"],
            "data-active": String(i === 0),
            "data-tab": block.tab,
          },
          tagName: "div",
          type: "element",
        };
        tabPanels.push(panel);
      }

      const tabsContainer: Element = {
        children: [
          {
            children: tabLabels.map((label, i) => ({
              children: [{ type: "text", value: label }],
              properties: {
                "aria-selected": String(i === 0),
                className:
                  i === 0 ? ["code-tab", "code-tab-active"] : ["code-tab"],
                "data-tab": label,
                role: "tab",
                type: "button",
              },
              tagName: "button",
              type: "element",
            })),
            properties: {
              className: ["code-tabs-list"],
              role: "tablist",
            },
            tagName: "div",
            type: "element",
          },
          ...tabPanels,
        ],
        properties: {
          className: ["code-tabs-container"],
          "data-group-id": group.groupId,
        },
        tagName: "div",
        type: "element",
      };

      // Replace first block with container
      if (Array.isArray(group.parentNode.children)) {
        group.parentNode.children[group.startIndex] = tabsContainer;

        // Mark subsequent blocks for removal (set to null, then filter)
        for (let i = 1; i < group.blocks.length; i += 1) {
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

  for (let i = 0; i < codeBlocks.length; i += 1) {
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
    for (let j = i + 1; j < codeBlocks.length; j += 1) {
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
      tabGroupCounter += 1;
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
  for (let k = index1 + 1; k < index2; k += 1) {
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
      children: [
        {
          children: [
            {
              children: fromHtml(getFileIconSvg(filename), {
                fragment: true,
              }).children as Element[],
              properties: {
                className: ["code-block-icon"],
              },
              tagName: "span",
              type: "element",
            },
            {
              children: [{ type: "text", value: filename }],
              properties: {},
              tagName: "span",
              type: "element",
            },
          ],
          properties: {
            className: ["code-block-header-filename"],
            "data-filename": filename,
          },
          tagName: "div",
          type: "element",
        },
        {
          children: [],
          properties: {
            className: ["copy-button-placeholder"],
          },
          tagName: "div",
          type: "element",
        },
      ],
      properties: {
        className: ["code-block-header"],
      },
      tagName: "div",
      type: "element",
    };
    wrapperChildren.push(headerElement);
  }

  if (preElement) {
    wrapperChildren.push(preElement);
  }

  if (!filename) {
    const copyButtonContainer: Element = {
      children: [
        {
          children: [],
          properties: {
            className: ["copy-button-placeholder"],
          },
          tagName: "div",
          type: "element",
        },
      ],
      properties: {
        className: ["copy-button-container"],
      },
      tagName: "div",
      type: "element",
    };
    wrapperChildren.push(copyButtonContainer);
  }

  return {
    children: wrapperChildren,
    properties: {
      className: filename ? ["shiki-wrapper", "has-header"] : ["shiki-wrapper"],
      "data-language": lang,
      "data-line-numbers": String(showLineNumbers),
      ...(filename && { "data-filename": filename }),
    },
    tagName: "div",
    type: "element",
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
