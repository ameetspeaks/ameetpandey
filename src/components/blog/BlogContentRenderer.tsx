import { useMemo, useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

type HeadingLevel = "h1" | "h2" | "h3";

type BlogBlock =
  | { type: "heading"; level: HeadingLevel; text: string }
  | { type: "paragraph"; text: string }
  | { type: "blockquote"; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "code"; language?: string; code: string; title?: string }
  | { type: "terminal"; language?: string; title?: string; command?: string; output?: string }
  | { type: "callout"; kind?: "info" | "warning" | "tip" | "danger"; title?: string; text: string }
  | { type: "image"; url: string; alt?: string; caption?: string }
  | { type: "gallery"; images: Array<{ url: string; alt?: string; caption?: string }> }
  | { type: "video"; url: string; title?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

const toId = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const CopyCodeButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <Button type="button" size="sm" variant="secondary" onClick={() => void onCopy()}>
      {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
};

export const extractHeadings = (blocks: BlogBlock[]) =>
  blocks
    .filter((block): block is Extract<BlogBlock, { type: "heading" }> => block.type === "heading")
    .map((block) => ({ id: toId(block.text), text: block.text, level: block.level }));

const BlogContentRenderer = ({ blocks }: { blocks: BlogBlock[] }) => {
  const normalized = useMemo(
    () =>
      blocks.length
        ? blocks
        : [
            {
              type: "paragraph" as const,
              text: "No content blocks yet. This article will be populated from the admin editor.",
            },
          ],
    [blocks],
  );

  return (
    <div className="blog-prose">
      {normalized.map((block, index) => {
        if (block.type === "heading") {
          const id = toId(block.text);
          const baseClass = "scroll-mt-24 font-bold text-foreground";

          if (block.level === "h1") {
            return (
              <h1 key={`${id}-${index}`} id={id} className={`${baseClass} text-3xl`}>
                {block.text}
              </h1>
            );
          }

          if (block.level === "h2") {
            return (
              <h2 key={`${id}-${index}`} id={id} className={`${baseClass} text-2xl`}>
                {block.text}
              </h2>
            );
          }

          return (
            <h3 key={`${id}-${index}`} id={id} className={`${baseClass} text-xl`}>
              {block.text}
            </h3>
          );
        }

        if (block.type === "paragraph") {
          return (
            <p key={index} className="leading-8 text-foreground/90">
              {block.text}
            </p>
          );
        }

        if (block.type === "blockquote") {
          return (
            <blockquote key={index} className="rounded-r-lg border-l-4 border-primary bg-secondary/70 px-4 py-3 text-foreground">
              {block.text}
            </blockquote>
          );
        }

        if (block.type === "list") {
          return block.ordered ? (
            <ol key={index} className="list-decimal space-y-2 pl-6 text-foreground/90">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ol>
          ) : (
            <ul key={index} className="list-disc space-y-2 pl-6 text-foreground/90">
              {block.items.map((item, itemIndex) => (
                <li key={`${item}-${itemIndex}`}>{item}</li>
              ))}
            </ul>
          );
        }

        if (block.type === "code") {
          return (
            <section key={index} className="surface-card overflow-hidden">
              <header className="flex items-center justify-between border-b border-border bg-secondary/70 px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground">{block.title || "Code snippet"}</p>
                <div className="flex items-center gap-2">
                  {block.language && <span className="rounded-full bg-background px-2 py-1 text-[11px] text-muted-foreground">{block.language}</span>}
                  <CopyCodeButton text={block.code} />
                </div>
              </header>
              <pre className="terminal-surface overflow-x-auto p-4 text-sm text-card-foreground">
                <code>{block.code}</code>
              </pre>
            </section>
          );
        }

        if (block.type === "terminal") {
          return (
            <section key={index} className="surface-card overflow-hidden">
              <header className="flex items-center justify-between border-b border-border bg-secondary/70 px-4 py-2">
                <p className="text-xs font-medium text-muted-foreground">{block.title || "Terminal"}</p>
                <div className="flex items-center gap-2">
                  {block.language && <span className="rounded-full bg-background px-2 py-1 text-[11px] text-muted-foreground">{block.language}</span>}
                  <CopyCodeButton text={`${block.command || ""}\n${block.output || ""}`.trim()} />
                </div>
              </header>
              <div className="terminal-surface space-y-3 p-4 font-mono text-sm leading-6 text-card-foreground">
                {block.command && (
                  <pre className="terminal-command overflow-x-auto">
                    <code>{block.command}</code>
                  </pre>
                )}
                {block.output && (
                  <pre className="terminal-output overflow-x-auto">
                    <code>{block.output}</code>
                  </pre>
                )}
              </div>
            </section>
          );
        }

        if (block.type === "callout") {
          const kind = block.kind || "info";
          return (
            <aside key={index} className={`blog-callout blog-callout-${kind}`}>
              {block.title && <p className="mb-1 font-semibold">{block.title}</p>}
              <p>{block.text}</p>
            </aside>
          );
        }

        if (block.type === "image") {
          return (
            <figure key={index} className="space-y-3">
              <img src={block.url} alt={block.alt || "Article image"} className="w-full rounded-xl border border-border object-cover" loading="lazy" />
              {block.caption && <figcaption className="text-center text-sm text-muted-foreground">{block.caption}</figcaption>}
            </figure>
          );
        }

        if (block.type === "gallery") {
          return (
            <div key={index} className="grid gap-3 sm:grid-cols-2">
              {block.images.map((image, imageIndex) => (
                <figure key={`${image.url}-${imageIndex}`} className="space-y-2">
                  <img src={image.url} alt={image.alt || "Gallery image"} className="w-full rounded-xl border border-border object-cover" loading="lazy" />
                  {image.caption && <figcaption className="text-xs text-muted-foreground">{image.caption}</figcaption>}
                </figure>
              ))}
            </div>
          );
        }

        if (block.type === "video") {
          return (
            <div key={index} className="aspect-video overflow-hidden rounded-xl border border-border">
              <iframe src={block.url} title={block.title || "Embedded video"} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />
            </div>
          );
        }

        if (block.type === "table") {
          return (
            <div key={index} className="data-table-wrap overflow-x-auto">
              <table className="data-table min-w-[620px]">
                <thead>
                  <tr>
                    {block.headers.map((header, headerIndex) => (
                      <th key={`${header}-${headerIndex}`}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {block.rows.map((row, rowIndex) => (
                    <tr key={`row-${rowIndex}`}>
                      {row.map((cell, cellIndex) => (
                        <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

export type { BlogBlock };
export default BlogContentRenderer;
