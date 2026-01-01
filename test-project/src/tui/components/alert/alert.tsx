import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps {
  /** Alert message content */
  children: React.ReactNode;
  /** Alert title */
  title?: string;
  /** Alert variant */
  variant?: AlertVariant;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Whether to show an icon */
  showIcon?: boolean;
}

const ICONS: Record<AlertVariant, string> = {
  info: "ℹ",
  success: "✓",
  warning: "⚠",
  error: "✗",
};

export function Alert({
  children,
  title,
  variant = "info",
  tokens: propTokens,
  showIcon = true,
}: AlertProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const variantColors: Record<AlertVariant, string> = {
    info: tokens.colors.accent,
    success: tokens.colors.success,
    warning: tokens.colors.warning,
    error: tokens.colors.danger,
  };

  const color = variantColors[variant];
  const icon = ICONS[variant];

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: color,
      paddingX: 1,
      paddingY: 0,
    },
    React.createElement(
      Box,
      { gap: 1 },
      showIcon ? React.createElement(Text, { color }, icon) : null,
      title ? React.createElement(Text, { color, bold: true }, title) : null
    ),
    React.createElement(
      Box,
      { paddingLeft: showIcon ? 2 : 0 },
      React.createElement(Text, { color: tokens.colors.fg }, children)
    )
  );
}
