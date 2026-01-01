import React, { useState, useCallback } from "react";
import { Box, Text, useInput } from "ink";
import type { Tokens } from "@hauktui/tokens";
import { useTokens, useFocusable } from "@hauktui/primitives-ink";
import { stableId } from "@hauktui/core";

export interface CollapsibleProps {
  /** Title/trigger for the collapsible */
  title: string;
  /** Content when expanded */
  children: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the collapsible is disabled */
  disabled?: boolean;
  /** Custom tokens override */
  tokens?: Tokens;
  /** Focus ID for focus management */
  focusId?: string;
  /** Icon when collapsed */
  collapsedIcon?: string;
  /** Icon when expanded */
  expandedIcon?: string;
}

export function Collapsible({
  title,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  tokens: propTokens,
  focusId,
  collapsedIcon = "▶",
  expandedIcon = "▼",
}: CollapsibleProps): React.ReactElement {
  const contextTokens = useTokens();
  const tokens = propTokens ?? contextTokens;
  const id = focusId ?? stableId("collapsible");
  const { isFocused } = useFocusable(id);

  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (disabled) return;

    const newOpen = !isOpen;
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  }, [isOpen, isControlled, disabled, onOpenChange]);

  useInput(
    (input, key) => {
      if (!isFocused || disabled) return;

      if (key.return || input === " ") {
        toggle();
      }
    },
    { isActive: isFocused }
  );

  const icon = isOpen ? expandedIcon : collapsedIcon;

  return React.createElement(
    Box,
    { flexDirection: "column" },
    // Trigger
    React.createElement(
      Box,
      {
        borderStyle: isFocused ? "round" : "single",
        borderColor: disabled
          ? tokens.colors.disabled
          : isFocused
            ? tokens.colors.focus
            : tokens.colors.border,
        paddingX: 1,
      },
      React.createElement(
        Text,
        {
          color: disabled
            ? tokens.colors.disabled
            : isFocused
              ? tokens.colors.accent
              : tokens.colors.fg,
          bold: isFocused,
          dimColor: disabled,
        },
        icon,
        " ",
        title
      )
    ),
    // Content
    isOpen
      ? React.createElement(
          Box,
          {
            flexDirection: "column",
            paddingLeft: 2,
            borderStyle: "single",
            borderColor: tokens.colors.border,
            borderTop: false,
            borderRight: false,
            borderBottom: false,
            marginLeft: 1,
          },
          children
        )
      : null
  );
}
