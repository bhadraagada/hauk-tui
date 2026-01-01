import React, { useEffect } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export type DrawerSide = "left" | "right" | "top" | "bottom";

export interface DrawerProps {
  /** Whether the drawer is open */
  open: boolean;
  /** Callback when drawer should close */
  onClose: () => void;
  /** Content of the drawer */
  children: React.ReactNode;
  /** Side to open from */
  side?: DrawerSide;
  /** Drawer title */
  title?: string;
  /** Drawer width (for left/right) or height (for top/bottom) */
  size?: number;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Show close button hint */
  showCloseHint?: boolean;
}

export function Drawer({
  open,
  onClose,
  children,
  side = "right",
  title,
  size = 40,
  tokens: propTokens,
  focusId,
  showCloseHint = true,
}: DrawerProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("drawer");
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

  const borderStyle = {
    left: {
      borderRight: true,
      borderLeft: false,
      borderTop: false,
      borderBottom: false,
    },
    right: {
      borderLeft: true,
      borderRight: false,
      borderTop: false,
      borderBottom: false,
    },
    top: {
      borderBottom: true,
      borderTop: false,
      borderLeft: false,
      borderRight: false,
    },
    bottom: {
      borderTop: true,
      borderBottom: false,
      borderLeft: false,
      borderRight: false,
    },
  }[side];

  const drawerContent = React.createElement(
    Box,
    {
      flexDirection: "column",
      width: isHorizontal ? size : "100%",
      height: isHorizontal ? "100%" : size,
      borderStyle: "single",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      ...borderStyle,
      paddingX: 1,
      paddingY: 1,
    },
    // Header
    title
      ? React.createElement(
          Box,
          { marginBottom: 1 },
          React.createElement(
            Text,
            { bold: true, color: tokens.colors.fg },
            title
          )
        )
      : null,
    // Content
    React.createElement(
      Box,
      { flexDirection: "column", flexGrow: 1 },
      children
    ),
    // Close hint
    showCloseHint
      ? React.createElement(
          Box,
          { marginTop: 1 },
          React.createElement(
            Text,
            { color: tokens.colors.muted, dimColor: true },
            "Press ESC or Q to close"
          )
        )
      : null
  );

  // Position the drawer based on side
  const containerProps: Record<string, unknown> = {
    flexDirection: isHorizontal ? "row" : "column",
  };

  if (side === "right" || side === "bottom") {
    containerProps.justifyContent = "flex-end";
  }

  return React.createElement(Box, containerProps, drawerContent);
}
