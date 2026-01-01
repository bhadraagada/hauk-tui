import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface HoverCardProps {
  /** The trigger element */
  children: React.ReactNode;
  /** Content to show in the hover card */
  content: React.ReactNode;
  /** Whether the hover card is visible */
  open: boolean;
  /** Position of the card */
  position?: "top" | "bottom" | "left" | "right";
  /** Width of the card */
  width?: number;
  /** Custom tokens override */
  tokens?: Tokens;
}

export function HoverCard({
  children,
  content,
  open,
  position = "bottom",
  width = 30,
  tokens: propTokens,
}: HoverCardProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;

  const cardElement = React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: tokens.colors.border,
      width,
      paddingX: 1,
      paddingY: 0,
      marginTop: position === "bottom" ? 0 : undefined,
      marginBottom: position === "top" ? 0 : undefined,
    },
    content
  );

  if (!open) {
    return React.createElement(Box, null, children);
  }

  const isVertical = position === "top" || position === "bottom";

  const containerProps: Record<string, unknown> = {
    flexDirection: isVertical ? "column" : "row",
    alignItems: isVertical ? "flex-start" : "center",
    gap: 0,
  };

  if (position === "top") {
    return React.createElement(Box, containerProps, cardElement, children);
  }

  if (position === "bottom") {
    return React.createElement(Box, containerProps, children, cardElement);
  }

  if (position === "left") {
    return React.createElement(Box, containerProps, cardElement, children);
  }

  return React.createElement(Box, containerProps, children, cardElement);
}
