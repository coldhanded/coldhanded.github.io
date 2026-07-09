import { textHtml } from "../core/html";
import { cellWidth } from "../core/layout";
import { normalizeText } from "../core/text";

type AnsiToken = {
  text: string;
  role?: string;
};

type RenderChunk = {
  text: string;
  role?: string;
};

const ansiRoles = new Map<string, string>([
  ["k", "black"],
  ["black", "black"],
  ["r", "red"],
  ["red", "red"],
  ["g", "green"],
  ["green", "green"],
  ["y", "yellow"],
  ["yellow", "yellow"],
  ["b", "blue"],
  ["blue", "blue"],
  ["m", "magenta"],
  ["magenta", "magenta"],
  ["c", "cyan"],
  ["cyan", "cyan"],
  ["w", "white"],
  ["white", "white"],
  ["K", "bright-black"],
  ["br-black", "bright-black"],
  ["bright-black", "bright-black"],
  ["R", "bright-red"],
  ["br-red", "bright-red"],
  ["bright-red", "bright-red"],
  ["G", "bright-green"],
  ["br-green", "bright-green"],
  ["bright-green", "bright-green"],
  ["Y", "bright-yellow"],
  ["br-yellow", "bright-yellow"],
  ["bright-yellow", "bright-yellow"],
  ["B", "bright-blue"],
  ["br-blue", "bright-blue"],
  ["bright-blue", "bright-blue"],
  ["M", "bright-magenta"],
  ["br-magenta", "bright-magenta"],
  ["bright-magenta", "bright-magenta"],
  ["C", "bright-cyan"],
  ["br-cyan", "bright-cyan"],
  ["bright-cyan", "bright-cyan"],
  ["W", "bright-white"],
  ["br-white", "bright-white"],
  ["bright-white", "bright-white"]
]);

const inkBlockPattern = /^\s*--\[ ink \]--\s*$/;
const inkMaskPrefixPattern = /^~(.*)$/;
const inkTextPrefixPattern = /^\|(.*)$/;

export function renderAnsiText(input: string, width: number): string {
  return renderBlocks(normalizeText(input).trim(), width).join("\n");
}

function renderBlocks(input: string, width: number): string[] {
  const lines = input.split("\n");
  const rendered: string[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    const match = lines[cursor].match(inkBlockPattern);

    if (!match) {
      const textLines: string[] = [];

      while (cursor < lines.length && !lines[cursor].match(inkBlockPattern)) {
        textLines.push(lines[cursor]);
        cursor += 1;
      }

      rendered.push(...renderPlainAnsiLines(textLines.join("\n"), width));
      continue;
    }

    const blockLines: string[] = [];
    cursor += 1;

    while (cursor < lines.length && lines[cursor].trim().length > 0) {
      blockLines.push(lines[cursor]);
      cursor += 1;
    }

    rendered.push(...renderInkBlock(blockLines, width));

    if (cursor < lines.length && lines[cursor].trim().length === 0) {
      rendered.push("");
      cursor += 1;
    }
  }

  return rendered;
}

function renderPlainAnsiLines(input: string, width: number): string[] {
  const output: string[] = [];
  let logicalLine: RenderChunk[] = [];

  for (const token of parseInlineAnsi(input)) {
    for (const char of token.text) {
      if (char === "\n") {
        output.push(...renderWordWrappedChunks(logicalLine, width));
        logicalLine = [];
        continue;
      }

      appendChunk(logicalLine, { text: char, role: token.role });
    }
  }

  output.push(...renderWordWrappedChunks(logicalLine, width));
  return output;
}

function renderWordWrappedChunks(chunks: RenderChunk[], width: number): string[] {
  const characters = splitChunksIntoCharacters(chunks);

  if (characters.length === 0) {
    return [""];
  }

  const output: string[] = [];
  let remaining = characters;

  while (characterLineWidth(remaining) > width) {
    const fitCount = countCharactersThatFit(remaining, width);

    if (
      fitCount < remaining.length &&
      /\s/u.test(remaining[fitCount].text) &&
      hasVisibleCharacterBefore(remaining, fitCount)
    ) {
      output.push(renderCharacterLine(remaining.slice(0, fitCount)));
      remaining = trimLeadingWhitespace(remaining.slice(fitCount));
      continue;
    }

    const whitespaceIndex = findLastBreakableWhitespace(remaining, fitCount);

    if (whitespaceIndex >= 0) {
      output.push(renderCharacterLine(trimTrailingWhitespace(remaining.slice(0, whitespaceIndex))));
      remaining = trimLeadingWhitespace(remaining.slice(whitespaceIndex + 1));
      continue;
    }

    const hardBreak = Math.max(fitCount, 1);
    output.push(renderCharacterLine(remaining.slice(0, hardBreak)));
    remaining = remaining.slice(hardBreak);
  }

  output.push(renderCharacterLine(remaining));
  return output;
}

function splitChunksIntoCharacters(chunks: RenderChunk[]): RenderChunk[] {
  const characters: RenderChunk[] = [];

  for (const chunk of chunks) {
    for (const char of chunk.text) {
      characters.push({ text: char, role: chunk.role });
    }
  }

  return characters;
}

function countCharactersThatFit(characters: RenderChunk[], width: number): number {
  let usedWidth = 0;

  for (let index = 0; index < characters.length; index += 1) {
    const nextWidth = cellWidth(characters[index].text);

    if (usedWidth + nextWidth > width) {
      return index;
    }

    usedWidth += nextWidth;
  }

  return characters.length;
}

function findLastBreakableWhitespace(characters: RenderChunk[], fitCount: number): number {
  for (let index = fitCount - 1; index >= 0; index -= 1) {
    if (/\s/u.test(characters[index].text) && hasVisibleCharacterBefore(characters, index)) {
      return index;
    }
  }

  return -1;
}

function hasVisibleCharacterBefore(characters: RenderChunk[], end: number): boolean {
  for (let index = 0; index < end; index += 1) {
    if (!/\s/u.test(characters[index].text)) {
      return true;
    }
  }

  return false;
}

function trimLeadingWhitespace(characters: RenderChunk[]): RenderChunk[] {
  let start = 0;

  while (start < characters.length && /\s/u.test(characters[start].text)) {
    start += 1;
  }

  return characters.slice(start);
}

function trimTrailingWhitespace(characters: RenderChunk[]): RenderChunk[] {
  let end = characters.length;

  while (end > 0 && /\s/u.test(characters[end - 1].text)) {
    end -= 1;
  }

  return characters.slice(0, end);
}

function characterLineWidth(characters: RenderChunk[]): number {
  return characters.reduce((total, character) => total + cellWidth(character.text), 0);
}

function renderCharacterLine(characters: RenderChunk[]): string {
  const chunks: RenderChunk[] = [];

  for (const character of characters) {
    appendChunk(chunks, character);
  }

  return renderChunks(chunks);
}

function renderInkBlock(lines: string[], width: number): string[] {
  const output: string[] = [];
  let cursor = 0;

  while (cursor < lines.length) {
    const textMatch = lines[cursor].match(inkTextPrefixPattern);
    const maskMatch = lines[cursor + 1]?.match(inkMaskPrefixPattern);

    if (textMatch && maskMatch) {
      output.push(...renderInkTextLine(textMatch[1] ?? "", maskMatch[1] ?? "", width));
      cursor += 2;
      continue;
    }

    if (lines[cursor].match(inkMaskPrefixPattern)) {
      cursor += 1;
      continue;
    }

    output.push(...renderPlainAnsiLines(lines[cursor], width));
    cursor += 1;
  }

  return output;
}

function renderInkTextLine(text: string, mask: string, width: number): string[] {
  const chunks: RenderChunk[] = [];
  let index = 0;

  for (const char of text) {
    const role = roleForMask(mask[index]);
    appendChunk(chunks, { text: char, role });
    index += 1;
  }

  return renderWrappedChunks(chunks, width);
}

function parseInlineAnsi(input: string): AnsiToken[] {
  const tokens: AnsiToken[] = [];
  let cursor = 0;
  let plain = "";

  while (cursor < input.length) {
    if (input[cursor] === "\\" && cursor + 1 < input.length) {
      plain += input[cursor + 1];
      cursor += 2;
      continue;
    }

    if (input.startsWith("#[", cursor)) {
      const parsed = parseMarker(input, cursor);

      if (parsed) {
        flushPlain();
        tokens.push({ text: parsed.text, role: parsed.role });
        cursor = parsed.end;
        continue;
      }
    }

    plain += input[cursor];
    cursor += 1;
  }

  flushPlain();
  return tokens;

  function flushPlain(): void {
    if (plain.length > 0) {
      tokens.push({ text: plain });
      plain = "";
    }
  }
}

function parseMarker(input: string, start: number): { role: string; text: string; end: number } | undefined {
  const pipe = findUnescaped(input, "|", start + 2);

  if (pipe === -1) {
    return undefined;
  }

  const close = findUnescaped(input, "]", pipe + 1);

  if (close === -1) {
    return undefined;
  }

  const alias = input.slice(start + 2, pipe).trim();
  const role = ansiRoles.get(alias);

  if (!role) {
    throw new Error(`Unknown ANSI role "${alias}".`);
  }

  return {
    role,
    text: unescapeAnsiText(input.slice(pipe + 1, close)),
    end: close + 1
  };
}

function findUnescaped(input: string, needle: string, start: number): number {
  for (let index = start; index < input.length; index += 1) {
    if (input[index] === "\\" && index + 1 < input.length) {
      index += 1;
      continue;
    }

    if (input[index] === needle) {
      return index;
    }
  }

  return -1;
}

function unescapeAnsiText(input: string): string {
  return input.replace(/\\([#[\]|\\])/g, "$1");
}

function roleForMask(char: string | undefined): string | undefined {
  if (!char || char === "." || char === " ") {
    return undefined;
  }

  const role = ansiRoles.get(char);

  if (!role) {
    throw new Error(`Unknown ink mask "${char}".`);
  }

  return role;
}

function appendChunk(chunks: RenderChunk[], chunk: RenderChunk): void {
  const previous = chunks[chunks.length - 1];

  if (previous && previous.role === chunk.role) {
    previous.text += chunk.text;
    return;
  }

  chunks.push(chunk);
}

function renderChunks(chunks: RenderChunk[]): string {
  return chunks
    .map((chunk) =>
      chunk.role ? `<span class="ansi ansi-${chunk.role}">${textHtml(chunk.text)}</span>` : textHtml(chunk.text)
    )
    .join("");
}

function renderWrappedChunks(chunks: RenderChunk[], width: number): string[] {
  const output: string[] = [];
  let lineChunks: RenderChunk[] = [];
  let lineWidth = 0;

  for (const chunk of chunks) {
    for (const char of chunk.text) {
      const charWidth = cellWidth(char);

      if (lineWidth + charWidth > width && lineWidth > 0) {
        flushLine();
      }

      appendChunk(lineChunks, { text: char, role: chunk.role });
      lineWidth += charWidth;
    }
  }

  flushLine();
  return output;

  function flushLine(): void {
    output.push(renderChunks(lineChunks));
    lineChunks = [];
    lineWidth = 0;
  }
}
