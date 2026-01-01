import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export type BannerFont = "block" | "slant" | "small" | "mini" | "simple";
export type BannerVariant = "default" | "gradient" | "box" | "minimal";

export interface BannerProps {
  /** The text to display as ASCII art banner */
  text: string;
  /** Font style for ASCII art */
  font?: BannerFont;
  /** Banner color */
  color?: string;
  /** Secondary color for gradient effect */
  gradientTo?: string;
  /** Banner variant */
  variant?: BannerVariant;
  /** Center the banner */
  center?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Additional subtitle text */
  subtitle?: string;
}

// Block-style font (like ANSI Shadow) - 6 lines tall
const BLOCK_FONT: Record<string, string[]> = {
  A: [" █████╗ ", "██╔══██╗", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
  B: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██████╔╝", "╚═════╝ "],
  C: [" ██████╗", "██╔════╝", "██║     ", "██║     ", "╚██████╗", " ╚═════╝"],
  D: ["██████╗ ", "██╔══██╗", "██║  ██║", "██║  ██║", "██████╔╝", "╚═════╝ "],
  E: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "███████╗", "╚══════╝"],
  F: ["███████╗", "██╔════╝", "█████╗  ", "██╔══╝  ", "██║     ", "╚═╝     "],
  G: [
    " ██████╗ ",
    "██╔════╝ ",
    "██║  ███╗",
    "██║   ██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  H: ["██╗  ██╗", "██║  ██║", "███████║", "██╔══██║", "██║  ██║", "╚═╝  ╚═╝"],
  I: ["██╗", "██║", "██║", "██║", "██║", "╚═╝"],
  J: ["     ██╗", "     ██║", "     ██║", "██   ██║", "╚█████╔╝", " ╚════╝ "],
  K: ["██╗  ██╗", "██║ ██╔╝", "█████╔╝ ", "██╔═██╗ ", "██║  ██╗", "╚═╝  ╚═╝"],
  L: ["██╗     ", "██║     ", "██║     ", "██║     ", "███████╗", "╚══════╝"],
  M: [
    "███╗   ███╗",
    "████╗ ████║",
    "██╔████╔██║",
    "██║╚██╔╝██║",
    "██║ ╚═╝ ██║",
    "╚═╝     ╚═╝",
  ],
  N: [
    "███╗   ██╗",
    "████╗  ██║",
    "██╔██╗ ██║",
    "██║╚██╗██║",
    "██║ ╚████║",
    "╚═╝  ╚═══╝",
  ],
  O: [
    " ██████╗ ",
    "██╔═══██╗",
    "██║   ██║",
    "██║   ██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  P: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔═══╝ ", "██║     ", "╚═╝     "],
  Q: [
    " ██████╗ ",
    "██╔═══██╗",
    "██║   ██║",
    "██║▄▄ ██║",
    "╚██████╔╝",
    " ╚══▀▀═╝ ",
  ],
  R: ["██████╗ ", "██╔══██╗", "██████╔╝", "██╔══██╗", "██║  ██║", "╚═╝  ╚═╝"],
  S: ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
  T: [
    "████████╗",
    "╚══██╔══╝",
    "   ██║   ",
    "   ██║   ",
    "   ██║   ",
    "   ╚═╝   ",
  ],
  U: [
    "██╗   ██╗",
    "██║   ██║",
    "██║   ██║",
    "██║   ██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  V: [
    "██╗   ██╗",
    "██║   ██║",
    "██║   ██║",
    "╚██╗ ██╔╝",
    " ╚████╔╝ ",
    "  ╚═══╝  ",
  ],
  W: [
    "██╗    ██╗",
    "██║    ██║",
    "██║ █╗ ██║",
    "██║███╗██║",
    "╚███╔███╔╝",
    " ╚══╝╚══╝ ",
  ],
  X: ["██╗  ██╗", "╚██╗██╔╝", " ╚███╔╝ ", " ██╔██╗ ", "██╔╝ ██╗", "╚═╝  ╚═╝"],
  Y: [
    "██╗   ██╗",
    "╚██╗ ██╔╝",
    " ╚████╔╝ ",
    "  ╚██╔╝  ",
    "   ██║   ",
    "   ╚═╝   ",
  ],
  Z: ["███████╗", "╚══███╔╝", "  ███╔╝ ", " ███╔╝  ", "███████╗", "╚══════╝"],
  "0": [
    " ██████╗ ",
    "██╔═████╗",
    "██║██╔██║",
    "████╔╝██║",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  "1": [" ██╗", "███║", "╚██║", " ██║", " ██║", " ╚═╝"],
  "2": ["██████╗ ", "╚════██╗", " █████╔╝", "██╔═══╝ ", "███████╗", "╚══════╝"],
  "3": ["██████╗ ", "╚════██╗", " █████╔╝", " ╚═══██╗", "██████╔╝", "╚═════╝ "],
  "4": ["██╗  ██╗", "██║  ██║", "███████║", "╚════██║", "     ██║", "     ╚═╝"],
  "5": ["███████╗", "██╔════╝", "███████╗", "╚════██║", "███████║", "╚══════╝"],
  "6": [
    " ██████╗ ",
    "██╔════╝ ",
    "███████╗ ",
    "██╔═══██╗",
    "╚██████╔╝",
    " ╚═════╝ ",
  ],
  "7": ["███████╗", "╚════██║", "    ██╔╝", "   ██╔╝ ", "   ██║  ", "   ╚═╝  "],
  "8": [" █████╗ ", "██╔══██╗", "╚█████╔╝", "██╔══██╗", "╚█████╔╝", " ╚════╝ "],
  "9": [" █████╗ ", "██╔══██╗", "╚██████║", " ╚═══██║", " █████╔╝", " ╚════╝ "],
  " ": ["   ", "   ", "   ", "   ", "   ", "   "],
  "!": ["██╗", "██║", "██║", "╚═╝", "██╗", "╚═╝"],
  ".": ["   ", "   ", "   ", "   ", "██╗", "╚═╝"],
  "-": ["      ", "      ", "█████╗", "╚════╝", "      ", "      "],
  _: ["        ", "        ", "        ", "        ", "███████╗", "╚══════╝"],
};

// Slant style font - 6 lines tall
const SLANT_FONT: Record<string, string[]> = {
  A: [
    "   ___   ",
    "  / _ |  ",
    " / __ |  ",
    "/_/ |_|  ",
    "         ",
    "         ",
  ],
  B: ["   ___ ", "  / _ )", " / _  |", "/____/ ", "       ", "       "],
  C: ["  _____", " / ___/", "/ /__  ", "\\___/  ", "       ", "       "],
  D: ["   ___ ", "  / _ \\", " / // /", "/____/ ", "       ", "       "],
  E: ["   ____", "  / __/", " / _/  ", "/___/  ", "       ", "       "],
  F: ["   ____", "  / __/", " / _/  ", "/_/    ", "       ", "       "],
  G: ["  _____", " / ___/", "/ (_ / ", "\\___/  ", "       ", "       "],
  H: ["   __ __", "  / // /", " / _  / ", "/_//_/  ", "        ", "        "],
  I: ["   ____", "  /  _/", " _/ /  ", "/___/  ", "       ", "       "],
  J: ["    __", " _ / /", "/ / / ", "\\__/  ", "      ", "      "],
  K: ["   __ __", "  / //_/", " / ,<   ", "/_/|_|  ", "        ", "        "],
  L: ["   __ ", "  / / ", " / /__", "/____/", "      ", "      "],
  M: [
    "   __  ___",
    "  /  |/  /",
    " / /|_/ / ",
    "/_/  /_/  ",
    "          ",
    "          ",
  ],
  N: ["   _  __", "  / |/ /", " /    / ", "/_/|_/  ", "        ", "        "],
  O: ["  ____ ", " / __ \\", "/ /_/ /", "\\____/ ", "       ", "       "],
  P: ["   ___ ", "  / _ \\", " / ___/", "/_/    ", "       ", "       "],
  Q: ["  ____ ", " / __ \\", "/ /_/ /", "\\___\\_\\", "       ", "       "],
  R: ["   ___ ", "  / _ \\", " / , _/", "/_/|_| ", "       ", "       "],
  S: ["   ____", "  / __/", " _\\ \\  ", "/___/  ", "       ", "       "],
  T: [" ______", "/_  __/", " / /   ", "/_/    ", "       ", "       "],
  U: ["  __  __", " / / / /", "/ /_/ / ", "\\____/  ", "        ", "        "],
  V: [" _   __", "| | / /", "| |/ / ", "|___/  ", "       ", "       "],
  W: [
    " _      __",
    "| | /| / /",
    "| |/ |/ / ",
    "|__/|__/  ",
    "          ",
    "          ",
  ],
  X: ["   _  __", "  | |/_/", " _>  <  ", "/_/|_|  ", "        ", "        "],
  Y: ["__  __", "\\ \\/ /", " \\  / ", " /_/  ", "      ", "      "],
  Z: [" ____", "/_  /", " / /_", "/___/", "     ", "     "],
  " ": ["    ", "    ", "    ", "    ", "    ", "    "],
};

// Small block font - 4 lines tall
const SMALL_FONT: Record<string, string[]> = {
  A: ["▄▀█", "█▀█", "   ", "   "],
  B: ["█▄▄", "█▄█", "   ", "   "],
  C: ["█▀▀", "█▄▄", "   ", "   "],
  D: ["█▀▄", "█▄▀", "   ", "   "],
  E: ["█▀▀", "██▄", "   ", "   "],
  F: ["█▀▀", "█▀ ", "   ", "   "],
  G: ["█▀▀", "█▄█", "   ", "   "],
  H: ["█ █", "█▀█", "   ", "   "],
  I: ["█", "█", " ", " "],
  J: [" █", "▀█", "  ", "  "],
  K: ["█▄▀", "█ █", "   ", "   "],
  L: ["█  ", "█▄▄", "   ", "   "],
  M: ["█▄ ▄█", "█ ▀ █", "     ", "     "],
  N: ["█▄ █", "█ ▀█", "    ", "    "],
  O: ["█▀█", "█▄█", "   ", "   "],
  P: ["█▀█", "█▀▀", "   ", "   "],
  Q: ["█▀█", "▀▀█", "   ", "   "],
  R: ["█▀█", "█▀▄", "   ", "   "],
  S: ["█▀▀", "▄▄█", "   ", "   "],
  T: ["▀█▀", " █ ", "   ", "   "],
  U: ["█ █", "█▄█", "   ", "   "],
  V: ["█ █", "▀▄▀", "   ", "   "],
  W: ["█ ▄ █", "▀▄▀▄▀", "     ", "     "],
  X: ["▀▄▀", "█ █", "   ", "   "],
  Y: ["█ █", " █ ", "   ", "   "],
  Z: ["▀▀█", "█▄▄", "   ", "   "],
  " ": ["  ", "  ", "  ", "  "],
};

// Mini font - 3 lines tall
const MINI_FONT: Record<string, string[]> = {
  A: ["█▀█", "█▀█", "▀ ▀"],
  B: ["██▄", "█▄█", "   "],
  C: ["█▀▀", "█▄▄", "   "],
  D: ["█▀▄", "█▄▀", "   "],
  E: ["█▀▀", "██▄", "   "],
  F: ["█▀▀", "█▀ ", "   "],
  G: ["█▀▀", "█▄█", "   "],
  H: ["█ █", "█▀█", "   "],
  I: ["█", "█", " "],
  J: [" █", "▀█", "  "],
  K: ["█▀▄", "█ █", "   "],
  L: ["█  ", "█▄▄", "   "],
  M: ["█▄█", "█ █", "   "],
  N: ["█▀█", "█ █", "   "],
  O: ["█▀█", "█▄█", "   "],
  P: ["█▀█", "█▀ ", "   "],
  Q: ["█▀█", "▀▀█", "   "],
  R: ["█▀█", "█▀▄", "   "],
  S: ["█▀▀", "▄▄█", "   "],
  T: ["▀█▀", " █ ", "   "],
  U: ["█ █", "█▄█", "   "],
  V: ["█ █", "▀▄▀", "   "],
  W: ["█ █", "▀▄▀", "   "],
  X: ["▀▄▀", "█ █", "   "],
  Y: ["█ █", " █ ", "   "],
  Z: ["▀▀█", "█▄▄", "   "],
  " ": ["  ", "  ", "  "],
};

// Simple font - 1 line, just bold text
const SIMPLE_FONT: Record<string, string[]> = {};

const FONTS: Record<string, Record<string, string[]>> = {
  block: BLOCK_FONT,
  slant: SLANT_FONT,
  small: SMALL_FONT,
  mini: MINI_FONT,
  simple: SIMPLE_FONT,
};

function getDefaultChar(height: number): string[] {
  return Array(height).fill(" ");
}

function textToAscii(text: string, font: BannerFont): string[] {
  if (font === "simple") {
    return [text.toUpperCase()];
  }

  const chars = text.toUpperCase().split("");
  const fontData = FONTS[font] || BLOCK_FONT;
  const sampleChar = fontData["A"] || fontData["H"];
  const height = sampleChar?.length || 6;

  const lines: string[] = Array(height).fill("");

  for (const char of chars) {
    const charArt = fontData[char] || fontData[" "] || getDefaultChar(height);
    for (let i = 0; i < height; i++) {
      lines[i] += charArt[i] || "";
    }
  }

  // Trim trailing empty lines
  while (lines.length > 0 && lines[lines.length - 1]!.trim() === "") {
    lines.pop();
  }

  return lines;
}

function interpolateColor(
  color1: string,
  color2: string,
  ratio: number
): string {
  // Simple color interpolation - just pick based on ratio
  if (ratio < 0.5) return color1;
  return color2;
}

export function Banner({
  text,
  font = "block",
  color,
  gradientTo,
  variant = "default",
  center = true,
  tokens: propTokens,
  subtitle,
}: BannerProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const asciiLines = textToAscii(text, font);
  const bannerColor = color || tokens.colors.accent;

  const renderLines = () => {
    return asciiLines.map((line, index) => {
      let textColor = bannerColor;

      if (gradientTo && asciiLines.length > 1) {
        const ratio = index / (asciiLines.length - 1);
        textColor = interpolateColor(bannerColor, gradientTo, ratio);
      }

      return React.createElement(
        Box,
        { key: index, justifyContent: center ? "center" : "flex-start" },
        React.createElement(Text, { color: textColor }, line)
      );
    });
  };

  const content = React.createElement(
    Box,
    { flexDirection: "column" },
    ...renderLines(),
    subtitle
      ? React.createElement(
          Box,
          { justifyContent: center ? "center" : "flex-start", marginTop: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.muted, dimColor: true },
            subtitle
          )
        )
      : null
  );

  if (variant === "box") {
    return React.createElement(
      Box,
      {
        flexDirection: "column",
        borderStyle: "round",
        borderColor: bannerColor,
        paddingX: 2,
        paddingY: 1,
      },
      content
    );
  }

  if (variant === "minimal") {
    return React.createElement(
      Box,
      { flexDirection: "column" },
      React.createElement(
        Box,
        { justifyContent: center ? "center" : "flex-start" },
        React.createElement(Text, { color: bannerColor, bold: true }, text)
      ),
      subtitle
        ? React.createElement(
            Box,
            { justifyContent: center ? "center" : "flex-start" },
            React.createElement(Text, { color: tokens.colors.muted }, subtitle)
          )
        : null
    );
  }

  return content;
}
