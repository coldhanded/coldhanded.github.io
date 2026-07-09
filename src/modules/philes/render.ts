import { textmodeConfig } from "../../config";
import { renderAnsiText } from "../textmode/ansi/render";
import { escapeHtml, link, textHtml } from "../textmode/core/html";

import { lifeFrameHeight, lifeFrameHtml } from "../textmode/life/art";
import type { Phile } from "./model";

export type PhileHeader = {
  metaHtml: string;
  sideHtml: string;
  lineCount: number;
  metaLineCount: number;
  titleLineCount: number;
};

export type PhileBodyBlock = {
  kind: "text" | "image";
  html: string;
};

export function renderPhileHeader(phile: Phile): PhileHeader {
  const titleLine = `[ ${phile.data.title} ]`;

  const metaLines = [titleLine, `~ ${phile.data.author}`];

  return {
    metaHtml: metaLines.map(textHtml).join("\n"),
    sideHtml: lifeFrameHtml(),
    lineCount: lifeFrameHeight,
    metaLineCount: metaLines.length,
    titleLineCount: 1
  };
}

export function renderPhileBodyBlocks(phile: Phile): PhileBodyBlock[] {
  return splitBodyBlocks(phile.body ?? "").map((block) => {
    if (block.kind === "image") {
      return {
        kind: "image",
        html: renderImage(block.src, block.alt)
      };
    }

    return {
      kind: "text",
      html: `${renderAnsiText(block.text, textmodeConfig.bodyWidth)}\n`
    };
  });
}

export function renderPhileFooterPre(phile: Phile): string {
  const volumeLabel =
    phile.route.volume === 0 ? "projects" : phile.route.volume === 1 ? "notes" : `volume_${phile.route.volume}`;

  return `\n\nret ${link("/", "[home]")} ${link(phile.route.volumeHref, `[${volumeLabel}]`)}\n`;
}

type ParsedBodyBlock =
  | {
      kind: "text";
      text: string;
    }
  | {
      kind: "image";
      src: string;
      alt: string;
    };

function splitBodyBlocks(input: string): ParsedBodyBlock[] {
  const blocks: ParsedBodyBlock[] = [];
  const textLines: string[] = [];

  for (const line of input.split("\n")) {
    const image = parseImageLine(line);

    if (!image) {
      textLines.push(line);
      continue;
    }

    flushTextBlock(blocks, textLines);
    blocks.push({
      kind: "image",
      ...image
    });
  }

  flushTextBlock(blocks, textLines);

  return blocks;
}

function flushTextBlock(blocks: ParsedBodyBlock[], textLines: string[]): void {
  const text = textLines.join("\n").trim();

  if (text.length > 0) {
    blocks.push({
      kind: "text",
      text
    });
  }

  textLines.length = 0;
}

function parseImageLine(line: string):
  | {
      src: string;
      alt: string;
    }
  | undefined {
  const markdownImage = line.match(/^\s*!\[([^\]]*)\]\((\S+?)(?:\s+["'][^"']*["'])?\)\s*$/);

  if (markdownImage) {
    return {
      alt: markdownImage[1],
      src: markdownImage[2]
    };
  }

  const htmlImage = line.match(/^\s*<img\b([^>]*)>\s*$/i);

  if (!htmlImage) {
    return undefined;
  }

  const attrs = htmlImage[1];
  const src = readHtmlAttr(attrs, "src");

  if (!src) {
    return undefined;
  }

  return {
    src,
    alt: readHtmlAttr(attrs, "alt") ?? ""
  };
}

function readHtmlAttr(attrs: string, name: string): string | undefined {
  const match = attrs.match(new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));

  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function renderImage(src: string, alt: string): string {
  const safeSrc = escapeHtml(src);
  const safeAlt = escapeHtml(alt);

  const caption = alt.trim().length > 0 ? `\n<figcaption>${textHtml(alt)}</figcaption>` : "";

  return `<figure class="phile-image"><button class="phile-image-trigger" type="button" data-lightbox-image aria-label="Open image preview"><img src="${safeSrc}" alt="${safeAlt}" loading="lazy" decoding="async" /></button>${caption}</figure>`;
}
