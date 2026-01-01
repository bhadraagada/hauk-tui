import React from "react";
import { Box, Text } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface PopoverProps {
  /** Content to display in the popover */
  content: React.ReactNode;
  /** Trigger element */
  children: React.ReactNode;
  /** Whether the popover is open */
  open: boolean;
  /** Position relative to trigger */
  position?: "top" | "bottom" | "left" | "right";
  /** Popover width */
  width?: number;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Optional title */
  title?: string;
}

export function Popover({
  content,
  children,
  open,
  position = "bottom",
  width = 30,
  tokens: propTokens,
  focusId,
  title,
}: PopoverProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("popover");
  const { isFocused } = useFocusable(id);

  const popoverContent = React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      width,
      paddingX: 1,
      paddingY: 0,
    },
    title
      ? React.createElement(
          Box,
          { marginBottom: 0 },
          React.createElement(
            Text,
            { bold: true, color: tokens.colors.fg },
            title
          )
        )
      : null,
    title
      ? React.createElement(
          Box,
          { marginBottom: 0 },
          React.createElement(
            Text,
            { color: tokens.colors.border },
            "─".repeat(width - 4)
          )
        )
      : null,
    React.createElement(Box, { flexDirection: "column" }, content)
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
    return React.createElement(Box, containerProps, popoverContent, children);
  }

  if (position === "bottom") {
    return React.createElement(Box, containerProps, children, popoverContent);
  }

  if (position === "left") {
    return React.createElement(Box, containerProps, popoverContent, children);
  }

  // right
  return React.createElement(Box, containerProps, children, popoverContent);
}
