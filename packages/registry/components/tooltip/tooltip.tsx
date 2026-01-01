import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface TooltipProps {
  /** The content to show in the tooltip */
  content: string;
  /** The element that triggers the tooltip */
  children: React.ReactNode;
  /** Whether the tooltip is visible */
  visible?: boolean;
  /** Tooltip position */
  position?: "top" | "bottom" | "left" | "right";
  /** Custom tokens override */
  tokens?: Tokens;
}

export function Tooltip({
  content,
  children,
  visible = false,
  position = "top",
  tokens: propTokens,
}: TooltipProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const tooltipElement = React.createElement(
    Box,
    {
      borderStyle: "round",
      borderColor: tokens.colors.border,
      paddingX: 1,
      backgroundColor: tokens.colors.bg,
    },
    React.createElement(Text, { color: tokens.colors.fg }, content)
  );

  if (!visible) {
    return React.createElement(Box, null, children);
  }

  const containerProps: Record<string, unknown> = {
    flexDirection:
      position === "top" || position === "bottom" ? "column" : "row",
    alignItems: "center",
    gap: 0,
  };

  if (position === "top") {
    return React.createElement(Box, containerProps, tooltipElement, children);
  }

  if (position === "bottom") {
    return React.createElement(Box, containerProps, children, tooltipElement);
  }

  if (position === "left") {
    return React.createElement(Box, containerProps, tooltipElement, children);
  }

  // right
  return React.createElement(Box, containerProps, children, tooltipElement);
}
