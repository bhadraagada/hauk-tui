import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface LabelProps {
  /** Label text */
  children: React.ReactNode;
  /** Whether the associated field is required */
  required?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Label position relative to its content */
  position?: "top" | "left";
  /** Description text below the label */
  description?: string;
}

export function Label({
  children,
  required = false,
  tokens: propTokens,
  position = "top",
  description,
}: LabelProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const labelContent = React.createElement(
    Box,
    { gap: 0 },
    React.createElement(
      Text,
      { color: tokens.colors.fg, bold: true },
      children
    ),
    required
      ? React.createElement(Text, { color: tokens.colors.danger }, " *")
      : null
  );

  if (description) {
    return React.createElement(
      Box,
      { flexDirection: "column" },
      labelContent,
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        description
      )
    );
  }

  return labelContent;
}
