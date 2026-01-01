import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens } from "@hauktui/primitives-ink";

export interface ConfirmDialogProps {
  /** Dialog title */
  title?: string;
  /** Dialog message */
  message: string;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel: () => void;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Whether confirm is destructive (shows in danger color) */
  destructive?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Whether to show the dialog */
  isOpen?: boolean;
}

export function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  tokens: propTokens,
  isOpen = true,
}: ConfirmDialogProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput(
    (input, key) => {
      if (!isOpen) return;

      if (key.leftArrow || key.rightArrow || key.tab) {
        setSelectedIndex((prev) => (prev === 0 ? 1 : 0));
      } else if (key.return) {
        if (selectedIndex === 0) {
          onConfirm();
        } else {
          onCancel();
        }
      } else if (key.escape) {
        onCancel();
      } else if (input === "y" || input === "Y") {
        onConfirm();
      } else if (input === "n" || input === "N") {
        onCancel();
      }
    },
    { isActive: isOpen }
  );

  if (!isOpen) return null;

  const confirmColor = destructive ? tokens.colors.danger : tokens.colors.accent;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor: tokens.colors.border,
      paddingX: 2,
      paddingY: 1,
    },
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
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(Text, { color: tokens.colors.muted }, message)
    ),
    React.createElement(
      Box,
      { gap: 2 },
      React.createElement(
        Box,
        {
          borderStyle: selectedIndex === 0 ? "round" : undefined,
          borderColor: selectedIndex === 0 ? confirmColor : undefined,
          paddingX: 1,
        },
        React.createElement(
          Text,
          {
            color: confirmColor,
            bold: selectedIndex === 0,
          },
          confirmLabel
        )
      ),
      React.createElement(
        Box,
        {
          borderStyle: selectedIndex === 1 ? "round" : undefined,
          borderColor: selectedIndex === 1 ? tokens.colors.focus : undefined,
          paddingX: 1,
        },
        React.createElement(
          Text,
          {
            color: tokens.colors.muted,
            bold: selectedIndex === 1,
          },
          cancelLabel
        )
      )
    ),
    React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        "Press Y/N or Enter to select"
      )
    )
  );
}
