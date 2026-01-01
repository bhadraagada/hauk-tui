import React from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export type SheetSide = "left" | "right" | "top" | "bottom";

export interface SheetProps {
  /** Whether the sheet is open */
  open: boolean;
  /** Callback when sheet should close */
  onClose: () => void;
  /** Content of the sheet */
  children: React.ReactNode;
  /** Side to open from */
  side?: SheetSide;
  /** Sheet title */
  title?: string;
  /** Sheet description */
  description?: string;
  /** Sheet width (for left/right) or height (for top/bottom) */
  size?: number;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Whether to show overlay effect */
  overlay?: boolean;
}

export function Sheet({
  open,
  onClose,
  children,
  side = "right",
  title,
  description,
  size = 50,
  tokens: propTokens,
  focusId,
  overlay = true,
}: SheetProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("sheet");
  const { isFocused } = useFocusable(id);

  useInput(
    (input, key) => {
      if (!open) return;
      if (key.escape || input === "q") {
        onClose();
      }
    },
    { isActive: open && isFocused }
  );

  if (!open) return null;

  const isHorizontal = side === "left" || side === "right";

  const sheetContent = React.createElement(
    Box,
    {
      flexDirection: "column",
      width: isHorizontal ? size : "100%",
      height: isHorizontal ? "100%" : size,
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      backgroundColor: tokens.colors.bg,
      paddingX: 2,
      paddingY: 1,
    },
    // Header
    title || description
      ? React.createElement(
          Box,
          { flexDirection: "column", marginBottom: 1 },
          title
            ? React.createElement(
                Text,
                { bold: true, color: tokens.colors.fg },
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
    // Separator
    title || description
      ? React.createElement(
          Box,
          { marginBottom: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.border },
            "─".repeat(size - 6)
          )
        )
      : null,
    // Content
    React.createElement(
      Box,
      { flexDirection: "column", flexGrow: 1 },
      children
    ),
    // Footer
    React.createElement(
      Box,
      { marginTop: 1, justifyContent: "space-between" },
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        "ESC to close"
      )
    )
  );

  const containerProps: Record<string, unknown> = {
    flexDirection: isHorizontal ? "row" : "column",
    width: "100%",
    height: "100%",
  };

  if (side === "right" || side === "bottom") {
    containerProps.justifyContent = "flex-end";
  }

  return React.createElement(Box, containerProps, sheetContent);
}
