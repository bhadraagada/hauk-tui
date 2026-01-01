import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface CardProps {
  /** Card title */
  title?: string;
  /** Card description */
  description?: string;
  /** Card content */
  children?: React.ReactNode;
  /** Card footer */
  footer?: React.ReactNode;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Border style */
  borderStyle?: "single" | "double" | "round" | "bold" | "classic";
  /** Card width */
  width?: number;
}

export function Card({
  title,
  description,
  children,
  footer,
  tokens: propTokens,
  borderStyle = "round",
  width,
}: CardProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle,
      borderColor: tokens.colors.border,
      paddingX: 1,
      paddingY: 0,
      width,
    },
    // Header
    title || description
      ? React.createElement(
          Box,
          { flexDirection: "column", marginBottom: children ? 1 : 0 },
          title
            ? React.createElement(
                Text,
                { color: tokens.colors.fg, bold: true },
                title
              )
            : null,
          description
            ? React.createElement(
                Text,
                { color: tokens.colors.muted, dimColor: true },
                description
              )
            : null
        )
      : null,
    // Content
    children
      ? React.createElement(Box, { flexDirection: "column" }, children)
      : null,
    // Footer
    footer
      ? React.createElement(
          Box,
          {
            marginTop: 1,
            paddingTop: 0,
            borderStyle: "single",
            borderTop: true,
            borderBottom: false,
            borderLeft: false,
            borderRight: false,
            borderColor: tokens.colors.border,
          },
          footer
        )
      : null
  );
}
