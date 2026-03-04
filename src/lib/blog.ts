import type { BlogBlock } from "@/components/blog/BlogContentRenderer";

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export const defaultBlocks: BlogBlock[] = [
  { type: "heading", level: "h2", text: "Introduction" },
  {
    type: "paragraph",
    text: "Start writing your technical insight here. Use clear, practical language and evidence-backed guidance.",
  },
];

export const extractPlainText = (blocks: BlogBlock[]) => {
  const parts: string[] = [];

  for (const block of blocks) {
    if (block.type === "paragraph" || block.type === "blockquote") parts.push(block.text);
    if (block.type === "heading") parts.push(block.text);
    if (block.type === "list") parts.push(block.items.join(" "));
    if (block.type === "callout") parts.push(block.title || "", block.text);
    if (block.type === "code") parts.push(block.title || "", block.code);
    if (block.type === "terminal") parts.push(block.title || "", block.command || "", block.output || "");
    if (block.type === "table") parts.push(block.headers.join(" "), block.rows.flat().join(" "));
  }

  return parts.join(" ").replace(/\s+/g, " ").trim();
};

export const estimateReadTime = (blocks: BlogBlock[]) => {
  const words = extractPlainText(blocks).split(" ").filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
};

export const excerptFromBlocks = (blocks: BlogBlock[]) => extractPlainText(blocks).slice(0, 160);
