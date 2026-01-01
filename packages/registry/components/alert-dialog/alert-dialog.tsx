import React from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export type AlertDialogVariant = "default" | "destructive";

export interface AlertDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Dialog title */
  title: string;
  /** Dialog description/message */
  description: string;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Callback when confirmed */
  onConfirm: () => void;
  /** Callback when cancelled */
  onCancel?: () => void;
  /** Dialog variant */
  variant?: AlertDialogVariant;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
}

export function AlertDialog({
  open,
  onClose,
  title,
  description,
  confirmLabel = "Continue",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  tokens: propTokens,
  focusId,
}: AlertDialogProps): React.ReactElement | null {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("alert-dialog");
  const { isFocused } = useFocusable(id);

  const [focused, setFocused] = React.useState<"cancel" | "confirm">("cancel");

  useInput(
    (input, key) => {
      if (!open) return;

      if (key.escape) {
        onCancel?.();
        onClose();
        return;
      }

      if (key.leftArrow || input === "h") {
        setFocused("cancel");
      } else if (key.rightArrow || input === "l") {
        setFocused("confirm");
      } else if (key.tab) {
        setFocused((prev) => (prev === "cancel" ? "confirm" : "cancel"));
      } else if (key.return) {
        if (focused === "confirm") {
          onConfirm();
          onClose();
        } else {
          onCancel?.();
          onClose();
        }
      } else if (input === "y" || input === "Y") {
        onConfirm();
        onClose();
      } else if (input === "n" || input === "N") {
        onCancel?.();
        onClose();
      }
    },
    { isActive: open && isFocused }
  );

  if (!open) return null;

  const confirmColor =
    variant === "destructive" ? tokens.colors.danger : tokens.colors.accent;

  return React.createElement(
    Box,
    {
      flexDirection: "column",
      borderStyle: "round",
      borderColor:
        variant === "destructive" ? tokens.colors.danger : tokens.colors.border,
      paddingX: 2,
      paddingY: 1,
      width: 50,
    },
    // Icon + Title
    React.createElement(
      Box,
      { gap: 1, marginBottom: 1 },
      React.createElement(
        Text,
        {
          color:
            variant === "destructive"
              ? tokens.colors.danger
              : tokens.colors.warning,
        },
        variant === "destructive" ? "⚠" : "ℹ"
      ),
      React.createElement(Text, { bold: true, color: tokens.colors.fg }, title)
    ),
    // Description
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(Text, { color: tokens.colors.muted }, description)
    ),
    // Separator
    React.createElement(
      Box,
      { marginBottom: 1 },
      React.createElement(Text, { color: tokens.colors.border }, "─".repeat(46))
    ),
    // Buttons
    React.createElement(
      Box,
      { gap: 2, justifyContent: "flex-end" },
      // Cancel button
      React.createElement(
        Box,
        {
          borderStyle: focused === "cancel" ? "round" : "single",
          borderColor:
            focused === "cancel" ? tokens.colors.focus : tokens.colors.border,
          paddingX: 2,
        },
        React.createElement(
          Text,
          {
            color:
              focused === "cancel" ? tokens.colors.fg : tokens.colors.muted,
          },
          cancelLabel
        )
      ),
      // Confirm button
      React.createElement(
        Box,
        {
          borderStyle: focused === "confirm" ? "round" : "single",
          borderColor:
            focused === "confirm" ? confirmColor : tokens.colors.border,
          paddingX: 2,
        },
        React.createElement(
          Text,
          {
            color: focused === "confirm" ? confirmColor : tokens.colors.muted,
            bold: focused === "confirm",
          },
          confirmLabel
        )
      )
    ),
    // Hint
    React.createElement(
      Box,
      { marginTop: 1 },
      React.createElement(
        Text,
        { color: tokens.colors.muted, dimColor: true },
        "Y/N to respond • Tab to switch • Enter to confirm"
      )
    )
  );
}
