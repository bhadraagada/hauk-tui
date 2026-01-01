import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface ProgressProps {
  /** Progress value (0-100) */
  value: number;
  /** Progress bar width in characters */
  width?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: "left" | "right" | "inside";
  /** Custom tokens override */
  tokens?: Tokens;
  /** Fill character */
  fillChar?: string;
  /** Empty character */
  emptyChar?: string;
}

export function Progress({
  value,
  width = 20,
  showLabel = true,
  labelPosition = "right",
  tokens: propTokens,
  fillChar = "█",
  emptyChar = "░",
}: ProgressProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  // Clamp value between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value));
  const filled = Math.round((clampedValue / 100) * width);
  const empty = width - filled;

  const bar = fillChar.repeat(filled) + emptyChar.repeat(empty);
  const label = `${Math.round(clampedValue)}%`;

  // Determine color based on progress
  let color = tokens.colors.accent;
  if (clampedValue >= 100) {
    color = tokens.colors.success;
  } else if (clampedValue < 30) {
    color = tokens.colors.warning;
  }

  const labelElement = showLabel
    ? React.createElement(Text, { color: tokens.colors.muted }, label)
    : null;

  if (labelPosition === "inside") {
    return React.createElement(
      Box,
      null,
      React.createElement(Text, { color }, "["),
      React.createElement(Text, { color }, bar),
      React.createElement(Text, { color }, "] "),
      labelElement
    );
  }

  return React.createElement(
    Box,
    { gap: 1 },
    labelPosition === "left" ? labelElement : null,
    React.createElement(Text, { color }, bar),
    labelPosition === "right" ? labelElement : null
  );
}
