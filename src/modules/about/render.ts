import { textmodeConfig } from "../../config";
import { link, textHtml } from "../textmode/core/html";
import { padCells, wrapWordsCells } from "../textmode/core/layout";
import { lifeFrameLines } from "../textmode/life/art";

const artIndent = textmodeConfig.volumeArtIndent;
const rightColumn = textmodeConfig.volumeRightColumn;
const innerWidth = rightColumn - 1;
const contentWidth = innerWidth - 2;
const paragraphWidth = contentWidth - 4;

const aboutParagraphs = [
  "Cold.",
  "I build small, practical systems and like understanding how the things I use actually work.",
  "I write about self-hosting, networking, privacy, open-source software, and keeping control of my own data.",
  "This site is where I document projects, write down what worked, and keep useful information somewhere I control.",
  "Outside of that, I am usually listening to music, playing games, messing with old hardware, or getting distracted by whatever project grabbed my attention that week."
];

const postscript = [
  "  ──[ EOF ]──────────────────────────────────────────────────────────────────//───",
  "",
  "  Tinkerer. Pragmatist. Minimalist.",
  "  Debugging perfectionism."
];

export function renderAboutPre(): string {
  return `\n${renderAboutFrame()}\n\n${textHtml(postscript.join("\n"))}\n\n  ~ ret ${link("/", "[home]")}\n`;
}

function renderAboutFrame(): string {
  const imageFrame = lifeFrameLines();
  const contentLines = aboutParagraphs.flatMap((paragraph, index) => [
    ...(index === 0 ? [] : [""]),
    ...wrapWordsCells(paragraph, paragraphWidth).map((line) => `  ${line}`)
  ]);

  const lines = [
    ...imageFrame.slice(0, 14).map((line) => `${" ".repeat(artIndent)}${line}`),
    `┌${"─".repeat(artIndent - 1)}${imageFrame[14]}`,
    `│ ${padCells("", artIndent - 2)}${imageFrame[15]}`,
    `│ ${padCells("[ About ] - A little context.", artIndent - 2)}${imageFrame[16]}`,
    frameLine(""),
    ...contentLines.map(frameLine),
    frameLine(""),
    `└${"─".repeat(innerWidth)}┘`
  ];

  return textHtml(lines.join("\n"));
}

function frameLine(input: string): string {
  return `│ ${padCells(input, contentWidth)} │`;
}
