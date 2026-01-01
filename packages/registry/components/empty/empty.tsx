import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface EmptyProps {
  /** Main title/message */
  title?: string;
  /** Description text */
  description?: string;
  /** Icon or emoji to display */
  icon?: string;
  /** Action element (e.g., button) */
  action?: React.ReactNode;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const ICONS = {
  empty: "📭",
  search: "🔍",
  error: "❌",
  folder: "📁",
  file: "📄",
  inbox: "📥",
};

export function Empty({
  title = "No data",
  description,
  icon = "📭",
  action,
  tokens: propTokens,
  size = "md",
}: EmptyProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const sizeConfig = {
    sm: { iconSize: 1, padding: 1 },
    md: { iconSize: 2, padding: 2 },
    lg: { iconSize: 3, padding: 3 },
  };

  const config = sizeConfig[size];

  // ASCII art versions for larger sizes
  const asciiIcons: Record<string, string[]> = {
    "📭": ["┌─────────┐", "│  EMPTY  │", "└────┬────┘", "     │     "],
    "🔍": [" ╭───╮ ", " │   │╲", " ╰───╯ ╲"],
    "❌": ["╲   ╱", " ╲ ╱ ", " ╱ ╲ ", "╱   ╲"],
    "📁": ["┌──┬────┐", "│  └────┤", "│       │", "└───────┘"],
  };

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      alignItems: "center",
      padding: config.padding,
    },
    // Icon
    size === "lg" && asciiIcons[icon]
      ? React.createElement(
          Box,
          { flexDirection: "column", marginBottom: 1 },
          asciiIcons[icon]!.map((line, i) =>
            React.createElement(
              Text,
              { key: i, color: tokens.colors.muted },
              line
            )
          )
        )
      : React.createElement(
          Text,
          { color: tokens.colors.muted },
          icon.repeat(size === "md" ? 1 : 1)
        ),
    // Title
    React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(
        Text,
        { color: tokens.colors.fg, bold: size !== "sm" },
        title
      )
    ),
    // Description
    description
      ? React.createElement(
          Box,
          { marginTop: size === "sm" ? 0 : 1 },
          React.createElement(
            Text,
            { color: tokens.colors.muted, dimColor: true },
            description
          )
        )
      : null,
    // Action
    action ? React.createElement(Box, { marginTop: 1 }, action) : null
  );
}
