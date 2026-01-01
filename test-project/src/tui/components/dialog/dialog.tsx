import React from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable, FocusGroup } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface DialogProps {
  /** Dialog title */
  title: string;
  /** Dialog description/content */
  children: React.ReactNode;
  /** Whether the dialog is open */
  open?: boolean;
  /** Callback when dialog should close */
  onClose?: () => void;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Dialog width */
  width?: number;
  /** Show close hint */
  showCloseHint?: boolean;
}

export function Dialog({
  title,
  children,
  open = true,
  onClose,
  tokens: propTokens,
  focusId,
  width = 50,
  showCloseHint = true,
}: DialogProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("dialog");
  const { isFocused } = useFocusable(id);

  useInput(
    (input, key) => {
      if (!isFocused) return;
      if (key.escape || input === "q") {
        onClose?.();
      }
    },
    { isActive: isFocused }
  );

  if (!open) return null;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: isFocused ? tokens.colors.focus : tokens.colors.border,
      paddingX: 1,
      paddingY: 0,
      width,
    },
    // Title
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(Text, { color: tokens.colors.fg, bold: true }, title)
    ),
    // Content
    React.createElement(Box, { flexDirection: "column" }, children),
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
}
