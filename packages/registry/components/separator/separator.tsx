import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface SeparatorProps {
  /** Separator width in characters (or "full" for full width) */
  width?: number | "full";
  /** Separator character */
  char?: string;
  /** Optional label to show in the middle */
  label?: string;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Orientation */
  orientation?: "horizontal" | "vertical";
}

export function Separator({
  width = 40,
  char = "─",
  label,
  tokens: propTokens,
  orientation = "horizontal",
}: SeparatorProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  if (orientation === "vertical") {
    return React.createElement(Text, { color: tokens.colors.border }, "│");
  }

  const actualWidth = width === "full" ? 80 : width;

  if (label) {
    const labelLength = label.length + 2; // padding around label
    const sideWidth = Math.floor((actualWidth - labelLength) / 2);
    const leftLine = char.repeat(Math.max(0, sideWidth));
    const rightLine = char.repeat(
      Math.max(0, actualWidth - sideWidth - labelLength)
    );

    return React.createElement(
      Box,
      null,
      React.createElement(Text, { color: tokens.colors.border }, leftLine),
      React.createElement(
        Text,
        { color: tokens.colors.muted },
        " ",
        label,
        " "
      ),
      React.createElement(Text, { color: tokens.colors.border }, rightLine)
    );
  }

  return React.createElement(
    Text,
    { color: tokens.colors.border },
    char.repeat(actualWidth)
  );
}
